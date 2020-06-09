import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-operations-candidate-list',
  templateUrl: './operations-candidate-list.component.html',
  styleUrls: ['./operations-candidate-list.component.css']
})
export class OperationsCandidateListComponent implements OnInit {
  public browserRefresh: boolean;
  userName: String = "";
  operationsCandidateList: any = [];
  config: any;
  accessLevel: string = "";

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
    }
    route.queryParams.subscribe(
    params => this.config.currentPage= params['page']?params['page']:1 );
    this.getOperationsCandidateList();
}

 ngOnInit() {
      this.browserRefresh = browserRefresh;
      if (this.browserRefresh) {
            window.alert('You will be redirecting to login again.');
            this.router.navigate(['/login-component']);
      }
 }
pageChange(newPage: number) {
    this.router.navigate(['/operations-candidate-list'], { queryParams: { page: newPage } });
}

getOperationsCandidateList(){
  this.apiService.getOperationsCandidateList().subscribe((data) => {
   this.operationsCandidateList = data;   
  })  
}

}
