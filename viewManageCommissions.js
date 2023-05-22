import { LightningElement,wire,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import LightningAlert from 'lightning/alert';
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
    // @wire(getPicklistValues, {recordTypeId:this.writtenBenefitRecorTypeID, fieldApiName:CARRIER_BUSINESS_TYPE})
    // carrierBusinessList({data,error}){
    //     if(data){
    //         console.log('carrierBusinessList >>',data);
    //     }
    //     if(error){
    //         console.log('error >>',error);
    //     }
    // }
    // @wire(getPicklistValues,{recordTypeId : this.writtenBenefitRecorTypeID, fieldApiName: AGENCY_BUSINESS_TYPE})
    // agencyBusinessList({data,error}){
    //     if(data){
    //         console.log('agencyBusinessList >>>',data);
    //     }
    //     if(error){
    //         console.log('agencyBusinessList error >>>',error);
    //     }
    // }
    // @wire(getPicklistValues, {recordTypeId: this.writtenBenefitRecorTypeID, fieldNameApi:COMMISSION_BASIS})
    // commonBasisList({data,error}){
    //     if(data){
    //         console.log('commonBasisList >>',data);
    //     }
    //     if(error){
    //         console.log('commonBasisList error >>',error);
    //     }
    // }
    // @wire(getPicklistValues, {recordTypeId:this.writtenBenefitRecorTypeID, fieldApiName: PRODUCER_COMISSION_TYPE})
    // producerCommissionList({data,error}){
    //     if(data){
    //         console.log('producerCommissionList data >>',data);
    //     }
    //     if(error){
    //         console.log('producerCommissionList error >>',error);
    //     }
    // }
     @wire(getCommissionRate,{recId:'$recordId'})
         wiredPolicy({error,data}){
             if(data){
                 console.log('data >>',data);
                 this.dataItem = data ;
                 console.log('dataItem >>',this.dataItem);
                 this.displayTable = data.length == 0 ? true : false ;
                  this.sumPercent = data.reduce((acc,curr,i,arr) =>{
                    return acc + curr.VRNA__Production_Percent__c ;
                 },0);
                 console.log('sumPercent >>',this.sumPercent);
                // this.data = data[0];
                // this.carrierBusinessType = this.data.VRNA__Carrier_Business_Type__c;
                // this.agencyBusinessType = this.data.VRNA__Agency_Business_Type__c;
                // this.agencyCommissionPercent = this.data.VRNA__Agency_Percent__c;
                // this.currentAgencyCommission = `$${this.data.VRNA__Current_Agency_Commissions__c}`;
                // this.producerCommissionRuleId = this.data.VRNA__Producer_Commission_Rule_Id__c;
                // this.primaryProducer = this.data.VRNA__Primary_Producer__c;
                // this.subProducer = this.data.VRNA__Sub_Producer__c;
                // this.subProducer2 = this.data.VRNA__Sub_Producer_2__c;
                // this.splitType = this.data.VRNA__Split_Type__c;
                // this.commissionBasis = this.data.VRNA__Commission_Basis__c;
                // this.producerCommission = this.data.Internal_Producer_Commission__c;
                // this.commissionAmount = this.data.VRNA__Broker_Commission_Amount__c;
                // this.commissionableAgencyFee = this.data.VRNA__Agency_Fee__c;
                // this.commissionRate = this.data.VRNA__Producer_Commission_Rates_Inserted__c;
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
        this.template.querySelectorAll('.ProducerCommissionFields').forEach(field => field.submit());
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
    async handleValidation(event){
        console.log('Inside handleValidation >>',event.target.value);
        console.log('if condition >>',this.sumPercent + event.target.value)
        if((this.sumPercent + Number(event.target.value)) > 100){
            await LightningAlert.open({
                message: 'Sum of Production Percent Cannot be more than 100',
                theme: 'error', 
                label: 'Error!',
            });
        }
    }
}