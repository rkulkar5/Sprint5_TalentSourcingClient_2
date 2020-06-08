import { Router } from '@angular/router';
import { PreTechService } from './../../components/pre-tech-form/pre-tech-service';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-pre-tech-form',
  templateUrl: './pre-tech-form.component.html',
  styleUrls: ['./pre-tech-form.component.css']
})

export class PreTechFormComponent implements OnInit {

	
	result:any=[];
	jrss = "";
	userName = "";
mode= "";
	preTechAssmntQuestions:any = [];
 
 

  constructor(public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
	private preTechService: PreTechService,
    private apiService: ApiService) {
this.userName = this.router.getCurrentNavigation().extras.state.userName;
	}
    


 ngOnInit(): void {
	
	 this.getPreTechAssessmentQuestions();
	 
}

//Read the pre technical assessment questions (based on the given JRSS) to be filled by the candidate
getPreTechAssessmentQuestions() {

console.log("******* userName ****** ",this.userName);
     // Get jrss
    this.apiService.getCandidateJrss(this.userName).subscribe(
    (res) => {      
      this.jrss=res['JRSS'];
     
     
         this.preTechService.getPreTechAssessmentQuestions(this.jrss).subscribe(res => {
                 this.preTechAssmntQuestions = res;
         }, (error) => {
         console.log(error);
         });
    });
    
 } //end of loadQuestion()
 
 }