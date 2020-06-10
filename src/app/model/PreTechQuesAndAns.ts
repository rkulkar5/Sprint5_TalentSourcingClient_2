
//import { PreTechAnswer } from './PreTechAnswer';

export class PreTechQuesAndAns {


  public preTechQID: any;
  public jrss: any;
  public preTechQuestion: any;
  public userName: any;
  public answer: any;
  //public createdDate:Date;
  
  constructor(preTechQID,jrss, preTechQuestion,userName,answer) {

    this.preTechQID = preTechQID;
    this.jrss = jrss;
    this.preTechQuestion = preTechQuestion;
	this.userName = userName;
	this.answer = answer;
   // this.createdDate = new Date();
    }

}
