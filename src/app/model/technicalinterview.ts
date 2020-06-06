export class TechnicalInterview {


  public userName: any;
  public userScore: any;
  public quizNumber: any;
  public createdDate:Date;
  public smeScores:any=[];
  public avgTechScore:number;
  public smeResult:any;
  public smeFeedback;

  constructor(userName,userScore, quizNumber,smeScores,avgTechScore,smeResult,smeFeedback) {

    this.userName = userName;
    this.userScore = userScore;
    this.quizNumber = quizNumber;
    this.createdDate = new Date();
    this.smeScores=smeScores;
    this.avgTechScore = avgTechScore;
    this.smeResult = smeResult;
    this.smeFeedback = smeFeedback;

    }

}

