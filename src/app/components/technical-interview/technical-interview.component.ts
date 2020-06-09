import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import {TechnicalInterview} from './../../model/technicalinterview';
@Component({
  selector: 'app-technical-interview',
  templateUrl: './technical-interview.component.html',
  styleUrls: ['./technical-interview.component.css']
})
export class TechnicalInterviewComponent implements OnInit {

  techskillForm: FormGroup;
  candidateInterviewDetails:any=[];
  technologyStreamArray:any= [];
  scoreArray:any[];
  dynamicArray: any = [];
  newDynamic: any = {};
  JRSS:any;
  totalScore:number=0;
  averageScore:number=0;
  scoreValueArray:any=[];
  submitted = false;
  formReset = false;
  userName: String = "";
  accessLevel: String = "";
  constructor(private fb:FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
    private apiService: ApiService) {
    this.userName = this.router.getCurrentNavigation().extras.state.username;
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
    this.readCandidateTechnicalInterviewDetails(id);
    this.techskillForm = this.fb.group({
        finalscore:'',
        finalResult:'',
        feedback:'',
        techStream: this.fb.array([]) ,
      });

  }
  ngOnInit(): void {
    this.getTechnicalStreamFromJRSS();
  }
  techStream() : FormArray {
      return this.techskillForm.get("techStream") as FormArray
  }

  //Read candidate details
  readCandidateTechnicalInterviewDetails(id) {
    console.log("readTechInterviewDetails id ="+id)
    this.apiService.readTechInterviewDetails(id).subscribe(data => {
    console.log("readTechInterviewDetails data ="+data);
    for(var candidate of data){
       var userScore:number=candidate.userScore;

       if(userScore>=80){
        this.candidateInterviewDetails.push(candidate);
        break;
       }
     }
    });
  }


  newQuantity(): FormGroup {
    return this.fb.group({
      technologyStream:this.getTechnologyStream(),
      score: '0'
    })

  }

  getTechnicalStreamFromJRSS(){
     this.apiService.getJRSS().subscribe((data) => {
     this.JRSS = data;
     this.technologyStreamArray = [];
     for (var jrss of this.JRSS){
        for (var skill of jrss.technologyStream){
          this.technologyStreamArray.push(skill);
        }
      }
      this.newDynamic =this.technologyStreamArray;
      this.dynamicArray.push(this.newDynamic);
      this.techStream().push(this.newQuantity());
      //console.log("Technical Stream getjrss: "+ JSON.stringify(this.technologyStreamArray));
    })
  }

  getTechnologyStream() {
    return this.technologyStreamArray;
  }

  addQuantity(i:number) {
    if(i<(this.newDynamic.length-1)){
      this.newDynamic =this.getTechnologyStream();
      this.dynamicArray.push(this.newDynamic);
      this.techStream().push(this.newQuantity());
    }
  }

  removeQuantity(i:number) {
    if(this.dynamicArray.length ==1) {
        return false;
    } else {
        this.techStream().removeAt(i);
        this.dynamicArray.splice(i, 1);
        this.averageCalc("");
        return true;
    }


  }
  averageCalc(txtValue:string){
    this.totalScore=0;
    this.scoreValueArray=this.techskillForm.value.techStream;
    var scoreCount:number=0;
    for(var sc of this.scoreValueArray){
     var score:number=parseInt(sc.score);
      if(score>0){
        this.totalScore= this.totalScore + score;
        scoreCount++;
      }
    }
    this.averageScore=this.totalScore/scoreCount;
   }

   //Reset
  resetForm(){
    this.formReset = true;
    this.techskillForm.reset();
  }
//Cancel
 cancelForm(){
     this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list',{state:{username:this.userName}}))
 }


  onSubmit() {
    alert(this.techskillForm.value.techsmeName);
    this.submitted = true;
    let userName=this.candidateInterviewDetails[0].userName;
    let userScore=this.candidateInterviewDetails[0].userScore;
    let quizNumber=this.candidateInterviewDetails[0].quizNumber;
    this.apiService.getResultByUser(userName,quizNumber).subscribe(res => {
         //console.log('get the result data'+res['_id']+"\t"+ res['userName']);
          let updateResults=new TechnicalInterview(userName,userScore, quizNumber,
          this.techskillForm.value.techStream,
          this.averageScore,
          this.techskillForm.value.finalResult,
          this.techskillForm.value.feedback,
          this.techskillForm.value.techsmeName,
          new Date,
          "Completed");

          this.apiService.updateResults(res['_id'],updateResults).subscribe(res => {
          console.log('Candidate SME Interview Details updated successfully!');
          this.ngZone.run(() => this.router.navigateByUrl('/technical-interview-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
          }, (error) => {
          console.log(error);
          })
        }, (error) => {
         console.log(error);
    })
  }
}
