import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';


@Component({
  selector: 'app-technical-interview-list',
  templateUrl: './technical-interview-list.component.html',
  styleUrls: ['./technical-interview-list.component.css']
})
export class TechnicalInterviewListComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  accessLevel: String = "";
  TechnicalInterviewList: any = [];
  config: any;

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
      this.getTechnicalInterviewList();
  }

  ngOnInit(): void {
  }

  pageChange(newPage: number) {
        this.router.navigate(['/technical-interview-list'], { queryParams: { page: newPage } });
  }


  getTechnicalInterviewList(){
    this.apiService.getTechnicalInterviewList().subscribe((data) => {
     this.TechnicalInterviewList = data;
    })
  }
}
