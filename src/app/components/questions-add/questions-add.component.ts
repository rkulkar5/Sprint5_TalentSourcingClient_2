import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormArray,FormBuilder, Validators } from "@angular/forms";
import { Question } from 'src/app/model/questions';
import { ResourceLoader } from '@angular/compiler';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-questions-add',
  templateUrl: './questions-add.component.html',
  styleUrls: ['./questions-add.component.css']
})
export class QuestionsAddComponent implements OnInit {
  submitted = false;
  formReset = false;
  questionForm: FormGroup;
  uploadFile: String = "Please select a file";
  userName: String = "admin";
  JRSS:any = [];
  technologyStream:any = [];
  QuestionTypes:any = ['SingleSelect','MultiSelect'];
  answerArray:Array<String>=[];
  optionsArray:Array<Object>=[];
  questionID:any;
  file: File;
  arrayBuffer: any;
  filelist: any;
  constructor(public fb: FormBuilder,
                  private router: Router,
                  private ngZone: NgZone,
                  private apiService: ApiService) { this.readJRSS();this.mainForm();}

  ngOnInit() {this.apiService.getQuestionID().subscribe(
    (res) => {  
      if(!isNaN(res.questionID))    {            
      this.questionID=res.questionID;}
      else{
        this.questionID=0;
      }
    }, (error) => {
      console.log(error);
    });       }

  mainForm() {
      this.questionForm = this.fb.group({
        technologyStream: ['', [Validators.required]],
        questionType: ['', [Validators.required]],
        question: ['', [Validators.required]],
        option1: ['', [Validators.required]],
        option2: ['', [Validators.required]],
        option3: [],
        option4: [],
        option1checkbox:[],
        option2checkbox:[],
        option3checkbox:[],
        option4checkbox:[],
        answerID:[],
        questionID:[],
        
       
      })
    }

    // Getter to access form control
      get myForm(){
        return this.questionForm.controls;
      }
  // Choose JRSS with select dropdown
    updateJRSS(e){
      this.questionForm.get('JRSS').setValue(e, {
      onlySelf: true
      })
    }

  

  // Choose Technology Stream with select dropdown
      updateTechnologyStream(e){
        this.questionForm.get('TechnologyStream').setValue(e, {
        onlySelf: true
        })
      }


    // Get all Technology streams of all JRSS
    readJRSS(){
       this.apiService.getJRSS().subscribe((data) => {
       this.JRSS = data;
       this.technologyStream = [];
     for (var jrss of this.JRSS){
        for (var skill of jrss.technologyStream){
          this.technologyStream.push(skill);
        }
      }
           console.log("Technical Stream getjrss: "+ JSON.stringify(this.technologyStream));
    })
  
    }
  
    // Choose QuestionType with select dropdown
    updateQuestionTypes(e){
      this.questionForm.get('questionType').setValue(e, {
      onlySelf: true
      })
    }
    getTechnologyStream() {
      return this.technologyStream;
    }

    onSubmit() {
        this.submitted = true;
        this.formReset = false;
        if (!this.questionForm.valid) {
          console.log('error part');
          return false;
        } else {            
          this.answerArray=[];  
          this.optionsArray=[];
          this.questionForm.value.technologyStream=this.questionForm.value.technologyStream
          if(!(this.questionForm.value.option1checkbox || this.questionForm.value.option2checkbox
            || this.questionForm.value.option3checkbox || this.questionForm.value.option4checkbox)){
              alert("Answers not selected");
            } else if(!(this.questionForm.value.option4 || this.questionForm.value.option3)
            &&(this.questionForm.value.option4checkbox || this.questionForm.value.option3checkbox)){
              console.log('else if only 2 options');
              alert("You can't select answers where options are empty   ");
            }else if(!(this.questionForm.value.option4)
            &&(this.questionForm.value.option4checkbox)){
              console.log('else if only 3 options');
              alert("You can't select answers where options are empty   ");
            }else if(!(this.questionForm.value.option3) && (this.questionForm.value.option4)){
              alert("You can't fill option4 leaving option3 empty");
            }else{  
          if(this.questionForm.value.option1checkbox){
            this.answerArray.push("1");}
          if(this.questionForm.value.option2checkbox){
            this.answerArray.push("2");}
            if(this.questionForm.value.option3checkbox){
              this.answerArray.push("3");}
              if(this.questionForm.value.option4checkbox){
                this.answerArray.push("4");}                
                this.questionForm.value.answerID=this.answerArray.toString();
                if(!(this.questionForm.value.option4) && !(this.questionForm.value.option3)){
                  this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                    {optionID:2,option:this.questionForm.value.option2});      
                }
             else if(!this.questionForm.value.option4){
                  this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                    {optionID:2,option:this.questionForm.value.option2},
                    {optionID:3,option:this.questionForm.value.option3});      
                }
               else{this.optionsArray.push({optionID:1,option:this.questionForm.value.option1},
                {optionID:2,option:this.questionForm.value.option2},
                {optionID:3,option:this.questionForm.value.option3},
                {optionID:4,option:this.questionForm.value.option4}); 
               }        
              this.questionForm.value.options=this.optionsArray;
                //Validation for singleSelect
                if((this.questionForm.value.questionType=="SingleSelect")&& (this.answerArray.toString().length)>1)
                {console.log("only one"+this.questionForm.value.answerID)
                alert("Only one option can be selected as the questionType is SingleSelect");                
                return false;
              }       
              this.questionID++;                
              this.questionForm.value.questionID=this.questionID;
              
          this.apiService.createQuestion(this.questionForm.value).subscribe(
            (res) => {
              console.log('Question successfully created!');
              window.confirm('Succesfully added to QuestionBank');
              this.formReset = true;
              this.questionForm.reset();
              this.ngZone.run(() => this.router.navigateByUrl('/manage-questionbank'))
            }, (error) => {
              console.log(error);
            }); 
          }
        }
      } 
}



