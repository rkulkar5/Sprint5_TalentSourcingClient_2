import { Router } from '@angular/router';
import { PreTechService } from './../../components/pre-tech-form/pre-tech-service';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { PreTechQuesAndAns } from './../../model/PreTechQuesAndAns';


@Component({
  selector: 'app-pre-tech-form',
  templateUrl: './pre-tech-form.component.html',
  styleUrls: ['./pre-tech-form.component.css']
})

export class PreTechFormComponent implements OnInit {

	
	result:any=[];
	
	preTechQuesAndAns: PreTechQuesAndAns[] = [];
	jrss = "";
	userName = "";
	stage2_Status = "";
	
	stage2Completed=false;
mode= "instructions";
	preTechAssmntQuestions:any = [];
 
  constructor(
    private router: Router,
    private ngZone: NgZone,
	private preTechService: PreTechService,
    private apiService: ApiService) {
this.userName = this.router.getCurrentNavigation().extras.state.userName;
this.mode = this.router.getCurrentNavigation().extras.state.mode;

	}
 preTech(){
   this.mode="pre-tech"
 }

 ngOnInit(): void {
	console.log('here in pre',this.mode)
	 this.getPreTechAssessmentQuestions();
	 
}

//Read the pre technical assessment questions (based on the given JRSS) to be filled by the candidate
getPreTechAssessmentQuestions() {


this.preTechService.getStageStatusByUserName(this.userName).subscribe(
    (res) => {      
      this.stage2_Status = res['stage2_Status'];
	  
	  if (this.stage2_Status == "Completed") {
			this.stage2Completed =  true	  
	  }
	  console.log("******* this.stage2_Status ****** ",this.stage2_Status);
	  });
	  
     // Get jrss
    this.apiService.getCandidateJrss(this.userName).subscribe(
    (res) => {      
      this.jrss=res['JRSS'];
     
         this.preTechService.getPreTechAssessmentQuestions(this.jrss, this.userName).subscribe(res => {
		 
		 
		 this.preTechAssmntQuestions = res;
		 
		 this.preTechAssmntQuestions.forEach((quesAndAnswer) => { 
			
			var answer = "";
			if (quesAndAnswer.PreTechAnswers.length > 0) {
				answer = quesAndAnswer.PreTechAnswers[0].answer 
			 }
			this.preTechQuesAndAns.push(new PreTechQuesAndAns(quesAndAnswer.preTechQID, quesAndAnswer.jrss,
			quesAndAnswer.preTechQuestion,this.userName, answer));
						
	  });
		 
		 console.log("******* preTechQuesAndAns<<<< ****** ",this.preTechQuesAndAns);
         }, (error) => {
         console.log(error);
         });
    });
    
 } //end of loadQuestion()
 
 
 submitPreTechForm( preTechQAndA : PreTechQuesAndAns[]) {
 console.log("******* mode ****** ",this.mode);
 
     this.preTechService.saveOrSubmitPreTechAssmentDetails(preTechQAndA).subscribe(res => {

         }, (error) => {
         console.log(error);
         });
		 
		 if (this.mode == 'Submit') {
		 
			this.preTechService.updateStage2Status(this.userName).subscribe(
			(res) => {      
				console.log("Updated stage 2 status to Completed");
			  }
			);
			this.stage2Completed =  true;
		} else {
		
		this.stage2Completed = false;
		}
		
 
 }
 
 }