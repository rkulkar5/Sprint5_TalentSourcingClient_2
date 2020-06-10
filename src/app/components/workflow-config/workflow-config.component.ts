import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Workflow } from './../../model/workflow';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workflow-config',
  templateUrl: './workflow-config.component.html',
  styleUrls: ['./workflow-config.component.css']
})
export class WorkflowConfigComponent implements OnInit {
  submitted = false;
  formReset = false;
  workFlowForm: FormGroup;
  JRSS:any = [];
  userName: String = "admin";
  jrssDocId: String = "";

  constructor(public fb: FormBuilder,private apiService: ApiService, private router: Router) {
     this.mainForm();
     this.readJrss();
  }

  ngOnInit(): void {
  }

  // Choose designation with select dropdown
  updateJrssProfile(e) {
    this.workFlowForm.get('JRSS').setValue(e, {
      onlySelf: true
    })
  }

  // Getter to access form control
  get myForm(){
    return this.workFlowForm.controls;
  }

  mainForm() {
    this.workFlowForm = this.fb.group({
      JRSS: ['', [Validators.required]],
      stage1OnlineTechAssessment: [false],
      stage2PreTechAssessment: [false],
      stage3TechAssessment: [false],
      stage4ManagementInterview: [false],
      stage5ProjectAllocation: [false]
    })
   }

  // Get all Jrss
 readJrss(){
  this.apiService.getJRSS().subscribe((data) => {
  this.JRSS = data;
  })
 }

 readJrssDocId(){
     for (var jrss of this.JRSS){
       if(jrss.jrss == this.workFlowForm.value.JRSS){
         this.jrssDocId = jrss._id;
       }
     }
 }

 onSubmit() {

    this.submitted = true;
    this.readJrssDocId();
    if (!this.workFlowForm.valid) {
      return false;
    } else {

      let workflow = new Workflow(this.workFlowForm.value.stage1OnlineTechAssessment,
                                  this.workFlowForm.value.stage2PreTechAssessment,
                                  this.workFlowForm.value.stage3TechAssessment,
                                  this.workFlowForm.value.stage4ManagementInterview,
                                  this.workFlowForm.value.stage5ProjectAllocation);
      this.apiService.updateWorkflow(this.jrssDocId, workflow).subscribe(res => {
        console.log('Workflow details updated successfully!');
        alert('Workflow details added successfully');
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
             this.router.navigate(['/workflow-config']));
        }, (error) => {
        console.log(error);
        })
      }

 }

}
