import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  userName: String = "";
  account: String = "";
  accessLevel: String = "";
  name: String="";
  public browserRefresh: boolean;

  constructor(private router: Router,private apiService: ApiService) {
    
    this.browserRefresh = browserRefresh;
    if (this.router.getCurrentNavigation().extras.state != undefined) {
          this.userName = this.router.getCurrentNavigation().extras.state.username;
          this.account = this.router.getCurrentNavigation().extras.state.account;
          this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
          this.getCandidate();  
        }      
       
       
    
  }
  getCandidate(){
    this.apiService.getNameFromUsername(this.userName).subscribe( (res) => {
    this.name = res.name;        
  });
}

  ngOnInit(): void {
  
    if (browserRefresh) {
      alert('You are redirected to login screen.');
      this.router.navigateByUrl(
        'login-component',
       
      );

    }
    
  }

}
