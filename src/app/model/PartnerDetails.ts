export class PartnerDetails {
   finalResult: string;
   partnerFeedback: string;
   managerName: string;
   managementAssessmentDate: Date;
   stage4_status: string;

   constructor(finalResult, partnerFeedback,managerName,managementAssessmentDate,stage4_status) {
      this.finalResult = finalResult;
   		this.partnerFeedback = partnerFeedback;
   		this.managerName  = managerName;
   		this.managementAssessmentDate = managementAssessmentDate;
   		this.stage4_status = stage4_status;
   }

}
