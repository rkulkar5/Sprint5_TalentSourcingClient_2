export class Workflow {
    public stage1_OnlineTechAssessment: any;
    public stage2_PreTechAssessment: any;
		public stage3_TechAssessment: any;
		public stage4_ManagementInterview:any;
		public stage5_ProjectAllocation:any;

		constructor(stage1_OnlineTechAssessment,stage2_PreTechAssessment,
		            stage3_TechAssessment,stage4_ManagementInterview,
		            stage5_ProjectAllocation) {
        this.stage1_OnlineTechAssessment = stage1_OnlineTechAssessment;
		    this.stage2_PreTechAssessment = stage2_PreTechAssessment;
		    this.stage3_TechAssessment = stage3_TechAssessment;
        this.stage4_ManagementInterview = stage4_ManagementInterview;
        this.stage5_ProjectAllocation = stage5_ProjectAllocation;
    }

}

