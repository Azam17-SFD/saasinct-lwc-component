import { LightningElement,wire,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import LightningAlert from 'lightning/alert';
import createCommissionRate from '@salesforce/apex/ViewManageCommissionsController.createCommissionRate';
import {getObjectInfo, getPicklistValues, getPicklistValuesByRecordType} from 'lightning/uiObjectInfoApi';
import getCommissionRate from '@salesforce/apex/ViewManageCommissionsController.getCommissionRate';
import Producer_Sub_Producer_Commission_Rate from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c' ;
import POLICY_OBJECT from '@salesforce/schema/VRNA__Policy__c' ;
import POLICY from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.VRNA__Policy__c';
import INTERNAL_PRODUCER from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.VRNA__Producer_Sub_Producer__c';
import COMMISSION_PERCENT from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.VRNA__Commission_Percent__c';
import FLAT_RATE_COMMISSION from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.VRNA__Flat_Rate_Commission__c';
import OVERRIDE_PERCENT from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.Override_Percent__c';
import LEGACY_ID_ENT from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.Legacy_ID_from_Ent__c';
import LEGACY_ID from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.Legacy_ID__c';
import PRODUCTION_PERCENT from '@salesforce/schema/VRNA__Producer_Sub_Producer_Commission_Rate__c.VRNA__Production_Percent__c';
import CARRIER_BUSINESS_TYPE from '@salesforce/schema/VRNA__Policy__c.VRNA__Carrier_Business_Type__c';
import AGENCY_BUSINESS_TYPE from '@salesforce/schema/VRNA__Policy__c.VRNA__Agency_Business_Type__c';
import COMMISSION_BASIS from '@salesforce/schema/VRNA__Policy__c.VRNA__Commission_Basis__c';
import PRODUCER_COMISSION_TYPE from '@salesforce/schema/VRNA__Policy__c.VRNA__Producer_Commission_Type__c';


export default class ViewManageCommissions extends NavigationMixin(LightningElement) {

    @api recordId;

    @track dataItem;
    @track errorMessages = [];
    commissionId;
    test = 'test';
    show = false;
    show2 = false;
    showFlow = false;
    openmodel = false;
    objectName = Producer_Sub_Producer_Commission_Rate ;
    label = `Save & Next`;
    displayResetAgencyButton = false ;
    displayResetProducerButton = false ;
    writtenBenefitRecorTypeID = '0126A000000sVrDQAU';
    carrierBusinessType;
    agencyBusinessType;
    agencyCommissionPercent;
    currentAgencyCommission;
    producerCommissionRuleId;
    primaryProducer;
    subProducer;
    subProducer2;
    splitType;
    commissionBasis;
    producerCommission;
    commissionAmount;
    commissionableAgencyFee;
    commissionRate;
    producers;
    productionPercent;
    commissionAmount;
    commissionError;
    displayTable;
    sumPercent = 0;
    sumProdPercent = 0;
    cp1 = 0;
    cp2 = 0;
    cp3 = 0;
    agencyFields = [
        {AgencyCommissionRuleId : ''},
        {CarrierBusinessType : 'VRNA__Carrier_Business_Type__c'},
        {AgencyBusinessType : 'VRNA__Agency_Business_Type__c'},
        {AgencyCommission : 'VRNA__Agency_Percent__c'},
        {CurrentAgencyCommission : 'VRNA__Current_Agency_Commissions__c'}
        
    ]  
    fields = {
        policy             : POLICY ,
        internalProducer   : INTERNAL_PRODUCER,
        commissionPercent  : COMMISSION_PERCENT,
        flatRateCommission : FLAT_RATE_COMMISSION,
        overridePercent    : OVERRIDE_PERCENT,
        legacyIdEnt        : LEGACY_ID_ENT,
        legacyId           : LEGACY_ID,
        productionPercent  : PRODUCTION_PERCENT
    }
   
    @wire(getObjectInfo, {objectApiName:POLICY_OBJECT})
        policyInfo;
     @wire(getPicklistValuesByRecordType, {objectApiName:POLICY_OBJECT, recordTypeId:'0126A000000sVrDQAU'})
     getAllPicklistValues({data, error}){
         if(data){
            console.log('all picklist >>>', data);
         }
         if(error){
             console.log('getAllPicklistValues error >>',error);
         }
     }
    
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
                 console.log('data value :',data[8].VRNA__Production_Percent__c);
                 console.log('data type :',typeof(data[8].VRNA__Production_Percent__c));
                
              }
             if(error){
                 console.log('error>>>',error);
             }
         }
    handleNPSPCR(event){
        //this.showFlow = true;
        //this.openmodel = true;
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
    closeModal(event){
        this.openmodel = false;
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
      /*   if(this.show == true){
            if(Number(this.cp1)+Number(this.cp2)+Number(this.cp3) !== 100){
                console.log('sum >>',Number(this.cp1)+Number(this.cp2)+Number(this.cp3))
                this.cp1 = 0;
                this.cp2 = 0; 
                this.cp3 = 0;
                this.LightningAlert();
            }
            else{
            createCommissionRate({recId:this.recordId,percent1:this.cp1,percent2:this.cp2,percent3:this.cp3})
             .then(result => {
                console.log('Commission Records Created Successfully');
             })
             .catch(error => {
                console.log('error creating records');
            });
          } 
   } */
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