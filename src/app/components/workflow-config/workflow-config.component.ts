import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-workflow-config',
  templateUrl: './workflow-config.component.html',
  styleUrls: ['./workflow-config.component.css']
})
export class WorkflowConfigComponent implements OnInit {
  submitted = false;
  formReset = false;
  questionForm: FormGroup;
  JRSS:any = [];

  constructor(
    private apiService: ApiService
  ) 
  { 
    this.readJrss(); 
  }

  ngOnInit(): void {
  }

  // Get all Jrss
 readJrss(){
  this.apiService.getJRSS().subscribe((data) => {
  this.JRSS = data;
  console.log("data is "+this.JRSS); 
  })
 }

}
