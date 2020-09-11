import { ActivatedRoute, Router } from '@angular/router';
import { Component,NgZone, Input, OnChanges,ViewChild ,Injectable,OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { browserRefresh } from '../../app.component';
import { ApiService } from './../../service/api.service';
import { PartnerDetails } from './../../model/PartnerDetails';
import { appConfig } from './../../model/appConfig';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {TechnicalInterviewListComponent} from './../technical-interview-list/technical-interview-list.component';
import { ViewResult } from './../../model/viewResult';
import { SendEmail } from './../../model/sendEmail';
declare var $: any;




@Component({
  selector: 'app-partner-interview',
  templateUrl: './partner-interview.component.html',
  styleUrls: ['./partner-interview.component.css']
})
export class PartnerInterviewComponent implements OnChanges {
  users: any[] = [];
  Result: any = [];

  public browserRefresh: boolean;
  userName: String = "";
  PartnerInterviewList: any = [];
  config: any;
  accessLevel: String = "";
  mode: string = "";
  emailSelected = "";
  quizNumber;
  candidateDetails: any = [];
  candidateAssessmentDetails: any = [];
  userScore:number=0;
  assesmentDate="";
  questionCount:number=0;
  correctAnswerCount:number=0;
  showModal: boolean = false;
  partnerFeedbackForm: FormGroup;
  submitted = false;
  displayContractorUIFields: Boolean = false;
  displayRegularUIFields: Boolean = true;
  error = '';
  account: String = "";
  usersDetail:any = [];
  usersArray:any = [];
  fromAddress: String = "";
  emailSubject: String = "";
  emailMessage: String = "";
  toAddress: String = "";
  partnerInterviewDetails : any = [];
  filterObj = {};
  nameFilter: string;
  accountFilter: string;
  jrssFilter: string;
  dataSource = new MatTableDataSource<ViewResult>();
  displayedColumnsSector = ['Action','result_users[0].employeeName', 'result_users[0].JRSS','result_users[0].account','userScore','smeResult','cvDownload'];
  displayedColumns = ['Action','result_users[0].employeeName', 'result_users[0].JRSS','userScore','smeResult','cvDownload'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private actRoute: ActivatedRoute, private cv:TechnicalInterviewListComponent,private route: ActivatedRoute, private router: Router, private apiService: ApiService,private ngZone: NgZone,private fb: FormBuilder) {
  this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
        this.userName = this.router.getCurrentNavigation().extras.state.username;
        this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
        this.account = this.router.getCurrentNavigation().extras.state.account;
    }
    this.getPartnerInterviewList();
    this.mainForm();
}

 mainForm() {
    this.partnerFeedbackForm = this.fb.group({
      partnerFeedback: ['', [Validators.required]]
    })
  }

  pageChange(newPage: number) {
        this.router.navigate(['/partner-list'], { queryParams: { page: newPage } });
  }

  @ViewChild('content') content: any;
  ngOnChanges(): void {
  }

  ngOnInit(): void {
      this.accessLevel="partner";
      this.browserRefresh = browserRefresh;
      this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr =JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
      }

      this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'result_users[0].employeeName': return item.result_users[0].employeeName;
            case 'result_users[0].JRSS': return item.result_users[0].JRSS;
            case 'result_users[0].account': return item.result_users[0].account;
            default: return item[property];
          }
       }
      this.readResult();
  }

    ngAfterViewInit (){
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    getCandidateAssessmentDetails(userid,quizId,username,userScore,createdDate) {
      this.userName=username;
      this.quizNumber=quizId;
      this.userScore=userScore;
      this.assesmentDate=createdDate;
      this.mode="displayAssessmentModalBody";
      this.apiService.getCandidateAssessmentDetails(userid,quizId).subscribe((data) => {
      this.candidateAssessmentDetails = data;
      this.questionCount=this.candidateAssessmentDetails.results.length;
      this.correctAnswerCount=Math.round((userScore*this.questionCount)/100)
     })
  }


  // To Read the Results
  readResult() {
    if(this.account.toLocaleLowerCase() !=='sector'){
      this.apiService.getPartnerInterviewAccountList(this.account).subscribe((data) => {
        this.Result = data;
        this.users = data;
        this.dataSource.data =  data as ViewResult[];

      })
    } else {
      this.apiService.getPartnerInterviewList().subscribe((data) => {
        this.Result = data;
        this.users = data;
        this.dataSource.data =  data as ViewResult[];
      })
   }
  }



  onSelectionChange(value,quizNumber) {
    this.emailSelected = value;
    this.quizNumber=quizNumber;
  }

  getPartnerInterviewList(){
    if(this.account.toLocaleLowerCase() !=='sector'){
      this.apiService.getPartnerInterviewAccountList(this.account).subscribe((data) => {
        this.PartnerInterviewList = data;
      })
    } else {
    this.apiService.getPartnerInterviewList().subscribe((data) => {
     this.PartnerInterviewList = data;
      })
   }
  }

   initiateInterview() {
     if (this.emailSelected == "") {
       alert("Please select the candidate");
       return false;
     } else {
       this.router.navigate(['/initiate-partner-interview/', this.emailSelected], { state: { username: this.userName, accessLevel: this.accessLevel, account: this.account } })
     }
   }

  exceptionalApproval() {
    if (this.emailSelected == "") {
      alert("Please select the candidate");
      return false;
    } else {
      if (window.confirm("Are you sure you want to provide exemption approval?")) {
        this.showModal = true;
        this.content.open();
        this.partnerFeedbackForm.reset;
      } else {
        this.showModal = false;
      }
    }
  }

   onSubmit() {
      this.submitted = true;
      this.setEmailNotificationDetails();

      if(this.partnerFeedbackForm.value.partnerFeedback.length>0){
        let partnerDetails = new PartnerDetails("Exceptional Approval Given",
        this.partnerFeedbackForm.value.partnerFeedback,this.userName,new Date(), "Skipped");
        this.apiService.updateExceptionalApprovalForStage4(partnerDetails,this.emailSelected,this.quizNumber).subscribe(res => {
          window.alert('Successfully provided exceptional approval');
          this.getPartnerInterviewList();
          this.readResult();
          $("#myModal").modal("hide");

          // Send notification to the operation team
          let sendEmailObject = new SendEmail(this.fromAddress, this.toAddress, this.emailSubject, this.emailMessage);
          this.apiService.sendEmail(sendEmailObject).subscribe(
            (res) => {
              console.log("[Partner List Exceptional Approval] - Email sent successfully to " + this.toAddress);
            }, (error) => {
               console.log("[Partner List Exceptional Approval] - Error occurred while sending email to " + this.toAddress);
               console.log(error);
          });
          //window.location.reload();
        }, (error) => {
          console.log(error);
        })
      }
    }


   // Set email notification parameters
   setEmailNotificationDetails(){
     this.apiService.getUserByAccessLevel("management").subscribe( (res) => {
     this.usersDetail = res;
     this.usersArray = [];
     for (var value of this.usersDetail){
       this.usersArray.push(value.username);
     }
     this.toAddress = this.usersArray;
     }, (error) => {
       this.error = 'Error found while getting username from Users table'
       console.log(error);
     });

     this.fromAddress = this.userName;
     this.emailSubject = "Candidate Assignment Notification";
     // this.emailMessage = "Dear Team,<br><p>This is to formally notify that candidate "
     //     + this.partnerInterviewDetails[0].result_users[0].employeeName
     //     + " is added to the queue for job role " + this.partnerInterviewDetails[0].result_users[0].JRSS
     //     + ".</p><p>Please validate the candidate for new project assignment.</p>\
     //     <p>Regards, <br>DWP Partner Team</p>";

     this.emailMessage = "Dear Team,<br><p>This is to formally notify that candidate is added to the queue for job role.</p><p>Please validate the candidate for new project assignment.</p>\
         <p>Regards, <br>DWP Partner Team</p>";
   }


  get myForm() {
    return this.partnerFeedbackForm.controls;
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
  downloadCandidateResume(id){
    this.cv.downloadCandidateResume(id)
  }

  applyFilter(filterValue: string,key: string) {
    this.filterObj = {
          value: filterValue.trim().toLowerCase(),
          key: key
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilters() {
        this.dataSource.filter = '';
        this.nameFilter = '';
        this.accountFilter = '';
        this.jrssFilter = '';
  }

}
