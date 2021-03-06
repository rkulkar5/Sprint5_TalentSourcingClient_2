import { Component, OnInit, NgZone, Output, EventEmitter, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';
import { appConfig } from './../../model/appConfig';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import { Candidate } from './../../model/candidate';
import { ViewResult } from './../../model/viewResult';
import { TechIntSchedulerComponent } from '../tech-int-scheduler/tech-int-scheduler.component';


declare var $: any;

@Component({
  selector: 'app-technical-interview-list',
  templateUrl: './technical-interview-list.component.html',
  styleUrls: ['./technical-interview-list.component.css'],

})

@Injectable({
  providedIn: 'root'
})
export class TechnicalInterviewListComponent implements OnInit {

  @ViewChild(TechIntSchedulerComponent) techIntSchedulerComp:TechIntSchedulerComponent;


  public browserRefresh: boolean;
  userName: String = "";
  accessLevel: String = "";
  TechnicalInterviewList: any = [];
  meetingEventsByCandidate:any = [];
  config: any;
  emailSelected = "";
  interviewDate = "";
  account: String = "";
  quizNumber;
  technicalInterviewCandidateList: any = [];
  filteredUsers: any[] = [];
  form: FormGroup;
  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();
  candidateAssessmentDetails: any = [];
  mode: any;
  userScore: number = 0;
  assesmentDate = "";
  questionCount: number = 0;
  correctAnswerCount: number = 0;
  resumeName1: string;
  resumeBlob: Blob;
  resumeUploaded: boolean;
  showModal: boolean = false;
  smeFeedbackForm: FormGroup;
  formReset = false;
  submitted = false;
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  candidateDetails: any = [];
  AccountData:any = [];
  AccountList:any=[];
  filterObj = {};
  nameFilter: string;
  accountFilter: string;
  jrssFilter: string;
  loading = true;
  dataSource = new MatTableDataSource<ViewResult>();
  showCalendar: boolean = false;
  calEmployeeName = "";
  loginAccounts:any = [];

  displayedColumns = ['Action','result_users[0].employeeName', 'result_users[0].JRSS','userScore','preTechForm','meeting[0].startDate','cvDownload'];
  displayedColumnsSector = ['Action','result_users[0].employeeName', 'result_users[0].JRSS','result_users[0].account','userScore','preTechForm','meeting[0].startDate','cvDownload'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private router: Router, private apiService: ApiService, private ngZone: NgZone, private fb: FormBuilder) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
      this.userName = this.router.getCurrentNavigation().extras.state.username;
      this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      this.account = this.router.getCurrentNavigation().extras.state.account;
      this.loginAccounts = this.account.split(",");
      console.log("Accounts " +this.loginAccounts);
    }
    this.form = this.fb.group({
      employeeName: new FormControl(''),
      JRSS: new FormControl(''),
      account: new FormControl('')
    });

    this.getTechnicalInterviewList();
    this.mainForm();
    this.readAccount();
  }

  @ViewChild('content') content: any;
  @ViewChild('calendarContent') calendarContent: any;
  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    this.dataSource.filterPredicate = (data, filter) => {
          if (this.filterObj['key'] == 'employeeName'){
            data[this.filterObj['key']] = data.result_users[0].employeeName;
          } else if (this.filterObj['key'] == 'JRSS'){
            data[this.filterObj['key']] = data.result_users[0].JRSS;
          } else if (this.filterObj['key'] == 'account'){
            data[this.filterObj['key']] = data.result_users[0].account;
          }
          if(data[this.filterObj['key']] && this.filterObj['key']) {
              if (data[this.filterObj['key']].toLowerCase().startsWith(this.filterObj['value'])) {
                 return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
              }
          }
          return false;
    }
    this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'result_users[0].employeeName': return item.result_users[0].employeeName;
          case 'result_users[0].JRSS': return item.result_users[0].JRSS;
          case 'userScore': return item.userScore;
          case 'result_users[0].account': return item.result_users[0].account;
          case 'meeting[0].startDate': return item.meeting[0].startDate;
          default: return item[property];
        }
     }
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string,key: string) {
    this.filterObj = {
          value: filterValue.trim().toLowerCase(),
          key: key
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  mainForm() {
    this.smeFeedbackForm = this.fb.group({
      smeFeedback: ['', [Validators.required]]
    })
  }

  get myForm() {
    return this.smeFeedbackForm.controls;
  }
  skipMethod(){
    alert('Stage skipped');
  }

  // Get all Accounts
  readAccount(){
    this.apiService.getAccounts().subscribe((data) => {
    this.AccountData = data;
    //Remove 'sector' from Account collection
    for (var accValue of this.AccountData){
        if(accValue.account.toLowerCase() !== 'sector' ) {
          this.AccountList.push(accValue.account);
        }
    }
    })
  }

    // Choose account result with select dropdown
    updateAccountDetails(e) {
      this.form.get('account').setValue(e, {
      onlySelf: true
      })
    }


  //To read candidate details
  getCandidateDetails(username) {
    this.mode="displayModalBody";
    this.apiService.getCandidateDetails(username).subscribe((data) => {
         this.candidateDetails = data;
         if (this.candidateDetails[0].employeeType == 'Contractor') {
              this.displayContractorUIFields = true;
              this.displayRegularUIFields = false;
         } else {
              this.displayContractorUIFields = false;
              this.displayRegularUIFields = true;
         }
    })
}

  //To download candidate's CV if uploaded
  downloadCandidateResume(id) {
    this.apiService.getCandidateJrss(id).subscribe(data => {
      //Get resume Data
      this.resumeName1 = data['resumeName'];
      let resumeData1: String = data['resumeData'];

      var byteString = atob(resumeData1.split(',')[1]);
      // separate out the mime component
      var mimeString = resumeData1.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      this.resumeBlob = new Blob([ab], { type: mimeString });

      if (this.resumeName1 == "ResumeEmpty.doc") {
        this.resumeUploaded = false;
        alert('CV not uploaded');
      } else {
        this.resumeUploaded = true;
        saveAs(this.resumeBlob, this.resumeName1);
      }

    });
  }

  //submit
  onSubmit() {
    this.submitted = true;
   this.formReset = false;
   if (!this.smeFeedbackForm.valid) {
        return false;
   } else {
      if (window.confirm("Are you sure you want to provide exception approval?")) {
        this.apiService.updateExceptionalApproval(this.emailSelected, this.quizNumber,  this.smeFeedbackForm.value.smeFeedback).subscribe(res => {
          window.alert('Successfully moved candidate to next stage');
          this.showModal = false;
          this.getTechnicalInterviewList();
          $("#myExceptionModal").modal("hide");
        }, (error) => {
          console.log(error);
        })
      }
    }
  }

  resetForm() {
    this.formReset = true;
    this.smeFeedbackForm.reset();
  }

  exceptionalApproval() {
    if (this.emailSelected == "") {
      alert("Please select the candidate");
      return false;
    } else {
      this.showModal = true;
      this.resetForm();
      this.apiService.getMeetingEventsByCandidate(this.emailSelected).subscribe((res) => {
          this.meetingEventsByCandidate = res;
          if (this.meetingEventsByCandidate.length > 0) {
            if(this.meetingEventsByCandidate[0].user == this.userName){
             $("#myExceptionModal").modal("show");
              return false;
            } else {
              this.showModal = false;
              $('#myExceptionModal  .close').click();
              alert('You are not allowed to do Exception Approval as Schedule Interview is done by ' +this.meetingEventsByCandidate[0].user);
              return false;
            }
          } else {
            if(this.interviewDate == ""  || this.interviewDate == undefined){
              $("#myExceptionModal").modal("show");
               return false;
            }
          }
       }, (error) => {
          console.log("Error occurred while reading meeting events table - ",error);
     });
    }
  }



 openCalendar = false;
  scheduleInterview() {
    
    if (this.emailSelected == "") {
      this.openCalendar = false;
      alert("Please select a candidate")
      
      return false;
    } else {
      //this.openCalendar = true;
      this.techIntSchedulerComp.handleCandidateEvents(this.emailSelected, this.calEmployeeName,this.interviewDate );

     //this.calendarContent.open();
    $("#calendarModal").modal("show")
    }
 
  }


  closeCalendar() {
    this.getTechnicalInterviewList();
    this.techIntSchedulerComp.closeCalendar();
    //this.interviewDate = "";
    $("#calendarModal").modal("hide")
  }

  initiateInterview() {
    if (this.emailSelected == "") {
      alert("Please select the candidate");
      return false;
    }
    else {
      if(this.interviewDate == ""  || this.interviewDate == undefined){
      this.router.navigate(['/technical-list/', this.emailSelected], { state: { username: this.userName, quizId: this.quizNumber, accessLevel: this.accessLevel, account: this.account } })
    }else{ 
      this.apiService.getMeetingEventsByCandidate(this.emailSelected).subscribe((res) => {
       if(res[0].user == this.userName){
        this.router.navigate(['/technical-list/', this.emailSelected], { state: { username: this.userName, quizId: this.quizNumber, accessLevel: this.accessLevel, account: this.account } }) 
       }else{
       alert('You are not allowed to Initiate Interview as Schedule Interview is done by ' +res[0].user);
       }  
      })
    }}
  }

  onSelectionChange(value, calEmployeeName, quizNumber, interviewDate) {
    this.emailSelected = value;
    this.calEmployeeName = calEmployeeName;
    this.quizNumber = quizNumber;
    this.interviewDate = interviewDate;

  }

  getTechnicalInterviewList() {
    if(this.account.toLocaleLowerCase() !=='sector'){
      this.apiService.getTechnicalInterviewAccountList(this.account).subscribe((data) => {
        this.TechnicalInterviewList = data;
        console.log("data:"+this.TechnicalInterviewList);
        this.TechnicalInterviewList.forEach((item)=> {
        if (item.meeting.length <= 0) {item.meeting[0]=`{startDate: ""}`;}
        if ( this.emailSelected == item.meeting[0].candidateEmail) {
          this.interviewDate = item.meeting[0].startDate;
        }
      })
        this.technicalInterviewCandidateList = data;
        this.dataSource.data = data as ViewResult[];
      })
    }
    else{
    this.apiService.getTechnicalInterviewList().subscribe((data) => {
      this.TechnicalInterviewList = data;
      console.log("Sector data:"+this.TechnicalInterviewList);
      this.TechnicalInterviewList.forEach((item)=> {
        if (item.meeting.length <= 0) {item.meeting[0]=`{startDate: ""}`;}
        if ( this.emailSelected == item.meeting[0].candidateEmail) {
          this.interviewDate = item.meeting[0].startDate;
        }
      })
      this.technicalInterviewCandidateList = data;
      this.dataSource.data = data as ViewResult[];
     
      
    })
   }
  }

  search(filters: any): void {
    Object.keys(filters).forEach(key => (filters[key] === '' || filters[key] ===  null) ? delete filters[key] : key);
    this.filterUserList(filters, this.technicalInterviewCandidateList);
  }


  filterUserList(filters: any, candidateList: any): void {

    this.filteredUsers = candidateList;
    const keys = Object.keys(filters);

    const filterUser = user => {
      let result = keys.map(key => {
        if (key == "employeeName" || key == "JRSS" || key == "account") {
          if (user.result_users[0][key]) {
            return String(user.result_users[0][key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
          }
        }

        else if (user[key]) {
          return String(user[key]).toLowerCase().startsWith(String(filters[key]).toLowerCase())
        } else {
          return false;
        }
      });

      // To Clean Array from undefined if the age is passed so the map will fill the gap with (undefined)
      result = result.filter(it => it !== undefined);
      return result.reduce((acc, cur: any) => { return acc & cur }, 1)
    }
    this.filteredUsers = candidateList.filter(filterUser);
    this.TechnicalInterviewList = this.filteredUsers

  }

  getCandidateAssessmentDetails(userid, quizId, username, userScore, createdDate) {
    this.userName = username;
    this.quizNumber = quizId;
    this.userScore = userScore;
    this.assesmentDate = createdDate;
    this.mode = "displayAssessmentModalBody";
    this.apiService.getCandidateAssessmentDetails(userid, quizId).subscribe((data) => {
      this.candidateAssessmentDetails = data;
      this.questionCount = this.candidateAssessmentDetails.results.length;
      this.correctAnswerCount = Math.round((userScore * this.questionCount) / 100)

    })
  }

 clearFilters() {
        this.dataSource.filter = '';
        this.nameFilter = '';
        this.accountFilter = '';
        this.jrssFilter = '';
 }


}
