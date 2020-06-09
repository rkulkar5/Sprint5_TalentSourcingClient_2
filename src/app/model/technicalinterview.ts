export class TechnicalInterview {


  public userName: any;
  public userScore: any;
  public quizNumber: any;
  public createdDate:Date;
  public smeScores:any=[];
  public avgTechScore:number;
  public smeResult:any;
  public smeFeedback;
  public smeName;
  public smeAssessmentDate;
  public stage3_status;


  constructor(userName,userScore, quizNumber,smeScores,avgTechScore,smeResult,smeFeedback,smeName,smeAssessmentDate,stage3_status) {

    this.userName = userName;
    this.userScore = userScore;
    this.quizNumber = quizNumber;
    this.createdDate = new Date();
    this.smeScores=smeScores;
    this.avgTechScore = avgTechScore;
    this.smeResult = smeResult;
    this.smeFeedback = smeFeedback;
    this.smeName=smeName;
    this.smeAssessmentDate=smeAssessmentDate;
    this.stage3_status=stage3_status;

    }

}

