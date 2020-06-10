import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { OperationsDetails } from './../../model/OperationsDetails';

@Component({
  selector: 'app-operations-project-initiate',
  templateUrl: './operations-project-initiate.component.html',
  styleUrls: ['./operations-project-initiate.component.css']
})
export class OperationsProjectInitiateComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  operationsProjectDetails : any = []; 
  ProjectLocation: any=['Onshore','Offshore']; 
  operationsProjectForm: FormGroup;
  submitted = false;
  formReset = false;
  accessLevel: string = "";
  status: string = "Completed";

 constructor(public fb: FormBuilder, private actRoute: ActivatedRoute, private router: Router,private ngZone: NgZone,
  private apiService: ApiService) {
       this.userName = this.router.getCurrentNavigation().extras.state.username;          
       this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;            
       let id = this.actRoute.snapshot.paramMap.get('id');
       this.readOperationsProjectDetails(id); 
       this.mainForm();     
   }

   ngOnInit() {
        this.browserRefresh = browserRefresh;
        if (this.browserRefresh) {
            window.alert('You are redirected to login screen.');
            this.router.navigate(['/login-component']);
        }
   }

  mainForm() {
    this.operationsProjectForm = this.fb.group({
      projectLocation: ['', [Validators.required]],
      projectName: ['', [Validators.required]],
      projectPosition: ['', [Validators.required]],
      managementComments: ['', [Validators.required]]
    })
}

get myForm(){
  return this.operationsProjectForm.controls;
}

  // Choose Location with select dropdown
  updateLocation(e){    
    this.operationsProjectForm.get('projectLocation').setValue(e, {
    onlySelf: true
    })
  }

  //Read candidate project details
  readOperationsProjectDetails(id) {
    this.apiService.readOperationsProjectDetails(id).subscribe(data => {
      this.operationsProjectDetails = data;
    });
  }

  onSubmit(id) {
    this.submitted = true;
    if (!this.operationsProjectForm.valid) {
      return false;
    } else {
    let operationsDetails = new OperationsDetails(this.operationsProjectDetails[0].result_users[0].employeeName, this.operationsProjectForm.value.projectLocation,
      this.operationsProjectForm.value.projectName, this.operationsProjectForm.value.projectPosition, this.operationsProjectForm.value.managementComments, this.userName, new Date());

    // Insert into projectAlloc table
    this.apiService.insertOperationsDetails(operationsDetails).subscribe(
      (res) => {
          // Update Results table
          this.apiService.saveOperationsStatus(id, status).subscribe(
            (res) => {
              console.log("Operations stage status successfully updated to Results table!");
            }, (error) => {
              console.log(error);
            });
        console.log('Operations details successfully inserted to ProjectAlloc table!')
        this.ngZone.run(() => this.router.navigateByUrl('/operations-candidate-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
        }, (error) => {
          console.log(error);
        });
  }
}

//Reset
resetForm(){
 this.formReset = true;
 this.operationsProjectForm.reset();
}
//Cancel
cancelForm(){
  this.ngZone.run(() => this.router.navigateByUrl('/operations-candidate-list',{state:{username:this.userName,accessLevel:this.accessLevel}}))
}
}