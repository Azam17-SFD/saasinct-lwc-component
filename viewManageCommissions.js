import { LightningElement,wire,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import LightningAlert from 'lightning/alert';
import getCommissionRate from '@salesforce/apex/ViewManageCommissionsController.getCommissionRate';


export default class ViewManageCommissions extends NavigationMixin(LightningElement) {

    @api recordId;

    @track dataItem;
    @track errorMessages = [];
    show = false;
    show2 = false;
    showFlow = false;
    //label = `Save & Next`;
    displayResetAgencyButton = false ;
    displayResetProducerButton = false ;
    writtenBenefitRecorTypeID = '0126A000000sVrDQAU';
    
    commissionError;
    displayTable;
    sumPercent = 0;
    cp1 = 0;
    cp2 = 0;
    cp3 = 0;
    
    @wire(getCommissionRate,{recId:'$recordId'})
         wiredPolicy({error,data}){
             if(data){
                 console.log('data >>',data);
                 this.dataItem = data ;
                 console.log('dataItem >>',this.dataItem);
                 this.displayTable = data.length == 0 ? true : false ;
                  
                 data.forEach(val => {
                    console.log('val >> ',val.VRNA__Production_Percent__c);
                    if(val.VRNA__Production_Percent__c){
                        this.sumPercent += val.VRNA__Production_Percent__c;
                  }
                 })
                 console.log('sumPercent >>',this.sumPercent);
              }
             if(error){
                 console.log('error>>>',error);
             }
         }
    handleNPSPCR(event){
        
        this[NavigationMixin.Navigate]({
            type : 'standard__objectPage',
            attributes : {
                objectApiName : 'VRNA__Producer_Sub_Producer_Commission_Rate__c',
                actionName : 'new'
            }
        })
    }
    handleOverrideCheckbox(event){
        console.log('writtenBenefitRecorTypeID :',this.writtenBenefitRecorTypeID);
        if(event.target.value === 'checkbox-unique-id-80'){
            if(this.displayResetAgencyButton == true)
            this.displayResetAgencyButton = false;
            else
            this.displayResetAgencyButton = true;
        } 
        if(event.target.value === 'checkbox-unique-id-81'){
            if(this.displayResetProducerButton == true)
            this.displayResetProducerButton = false;
            else
            this.displayResetProducerButton = true;
        }
    }
    handleEdit1(event){
        this.show2 = true;
        
    }
    handleEdit2(event){
        this.show = true;
    }
    
    handleAgencySave(event){
      this.template.querySelectorAll('.AgencyCommissionFields').forEach(fields => fields.submit());
      this.show2 = false;
    }
    handleAgencySuccess(){
        const event = new ShowToastEvent({
            title : 'Policy Updated!!',
            message : 'Policy has been updated Successfully',
            variant : 'success'
        });
        this.dispatchEvent(event);
        this.show2 = false;
    }
    handleAgencyCancel(){
        this.show2 = false;
    }
    handleProducerSave(event){
        let sum = 0;
        const percentFields = Array.from(this.template.querySelectorAll('.ProductionPercentFields'));
        console.log('percentFields >> ',percentFields);
        percentFields.forEach(field =>{
            console.log('field >> ',field.value);
            if(field.value != undefined || field.value != null)
            sum += Number(field.value);
            console.log('sum >>',sum);
            return sum;
        });
       console.log('Sum >>',sum);
       if(sum == 100){
        this.template.querySelectorAll('.ProducerCommissionFields').forEach(field => {
            console.log('ProducerCommissionFields >>',field);
            field.submit()
        });
       }else this.LightningAlert();
      
   this.show = false;
    
}
    handleProducerSuccess(){
        if(this.commissionError === null || this.commissionError === ''){
        const event = new ShowToastEvent({
            title : 'Policy Updated!!',
            message : 'Policy has been updated Successfully',
            variant : 'success'
        });
        this.dispatchEvent(event);
        this.show = false;
    }
}
    handleProducerCancel(){
        this.show = false;
    }
    handleError(event) {
        this.commissionError = event.detail.detail;
       const events = new ShowToastEvent({
            title : 'Error Occured',
            message : event.detail.detail,
            variant : 'error'
        });
        this.dispatchEvent(events);
        console.log('handle error ',event.detail.detail);
    }
    async LightningAlert(){
        await LightningAlert.open({
            message: 'Sum of Production Percent Cannot be more than 100',
            theme: 'error', 
            label: 'Error!',
        }); 
    }
    handleValidation(event){
        console.log('Inside handleValidation >>',event.target.value);
        console.log('if condition >>',Number(this.sumPercent) + Number(event.target.value));
        if((Number(this.sumPercent) + Number(event.target.value)) > 100){
            //this.LightningAlert();
        }
    }
    handleProdFields(event){
    
        if(event.target.name == 'ProductionPercent1'){
            this.cp1 = event.target.value;
            console.log('ProductionPercent1',event.target.value);
        }else if(event.target.name == 'ProductionPercent2'){
            this.cp2 = event.target.value;
            console.log('ProductionPercent2',event.target.value);
        }else if(event.target.name == 'ProductionPercent3'){
            this.cp3 = event.target.value;
            console.log('ProductionPercent3',event.target.value);
        }

    }
}