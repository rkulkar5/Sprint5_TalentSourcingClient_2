import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-partner-interview',
  templateUrl: './partner-interview.component.html',
  styleUrls: ['./partner-interview.component.css']
})
export class PartnerInterviewComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  PartnerInterviewList: any = [];
  config: any;
  accessLevel: String = "";
  mode: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
      this.config = {
        currentPage: 1,
        itemsPerPage: 5,
        totalItems:0
      };
      this.browserRefresh = browserRefresh;
      if (!this.browserRefresh) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          console.log("accessLevel*",this.accessLevel);
      }
      route.queryParams.subscribe(
      params => this.config.currentPage= params['page']?params['page']:1 );
      this.getPartnerInterviewList();
  }

  ngOnInit(): void {
  }

  pageChange(newPage: number) {
        this.router.navigate(['/partner-interview'], { queryParams: { page: newPage } });
  }


  getPartnerInterviewList(){
    this.apiService.getPartnerInterviewList().subscribe((data) => {
     this.PartnerInterviewList = data;
    })
  }
}
