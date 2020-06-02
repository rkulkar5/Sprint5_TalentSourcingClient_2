export class PartnerDetails {
   finalResult: string;
   partnerFeedback: string;
   managerName: string;
   managementAssessmentDate: Date;
   skip_stage3: Boolean;

   constructor(finalResult, partnerFeedback,managerName,managementAssessmentDate,skip_stage3) {
      this.finalResult = finalResult;
   		this.partnerFeedback = partnerFeedback;
   		this.managerName  = managerName;
   		this.managementAssessmentDate = managementAssessmentDate;
   		this.skip_stage3 = skip_stage3;
   }

}
