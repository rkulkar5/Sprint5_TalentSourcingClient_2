import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone,ViewChild } from '@angular/core';
import { ReportService } from './report.service';
import { browserRefresh } from '../../app.component';
import { DatePipe } from '@angular/common'
import { appConfig } from './../../model/appConfig';
import { ReportStats } from './../../model/reportStats';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  currDate: Date = new Date();
  filters: Object;
  userName = "";
  accessLevel: String = "";
  public browserRefresh: boolean;
  reportResponse: any = [];
  reportData: any = [];
  reportObj = {};
  account : String ="";
  loginAccounts:any = [];

  itemsPerPage = appConfig.itemsPerPage;
  page=1;

  from_Date: any;
  to_Date: any;
  searchJrss: string;
  dataSource = new MatTableDataSource<ReportStats>();

  displayedColumns = ['row[0][1]', 'row[1][1]','row[2][1]', 'row[3][1]','row[4][1]','row[5][1]'];
  displayedColumnsMultiAccount = ['row[0][1]', 'row[1][1]','row[2][1]', 'row[3][1]','row[4][1]','row[5][1]','row[6][1]'];
  filterObj: { value: string; key: string; };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  accountSearch: string;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private reportService: ReportService,
    public datepipe: DatePipe
    ) {
    this.browserRefresh = browserRefresh;
    if (!this.browserRefresh) {
      this.userName = this.router.getCurrentNavigation().extras.state.username;
      this.accessLevel = this.router.getCurrentNavigation().extras.state.accessLevel;
      this.account = this.router.getCurrentNavigation().extras.state.account;
      this.loginAccounts = this.account.split(",");
    }
  }


// ****************************** start of getter and setter methods **********************************
  get fromDate(): Date {
    return this.from_Date;
  }
  get toDate(): Date {
    return this.to_Date;
  }
  get jrss(): string {
    return this.searchJrss;
  }

  get accounts():string{
    return this.accountSearch;
  }

  set accounts(account : string){
    //alert("Account" +account);
    //this.searchJrss = account;
      this.searchFilter();
  if(account){
  let reportDataByAccount: any = [];
      this.reportData.forEach((item) => {
        console.log("item:" +item[1][1]);
      
        if (item[1][1].toLowerCase().startsWith(account.toLowerCase())) {
        //  this.filterObj['key'].toLowerCase().includes(this.filterObj['value']);
          reportDataByAccount.push(item);
        }
      });
     
      this.reportData = reportDataByAccount;
     // console.log("reportData:" +this.reportData[0]);
      this.dataSource.data = this.reportData as ReportStats[];
}
  }

  set fromDate(fromDate: Date) {
    this.from_Date = fromDate;
    this.searchFilter();
  }

  set toDate(toDate: Date) {
    this.to_Date = toDate;

    if (toDate < this.from_Date) throw new Error(' sdfas ');
    this.searchFilter();
  }

  set jrss(jrss: string) {
    
    this.searchJrss = jrss;
      this.searchFilter();
    
    if(jrss) {
      //This is to filter based on JRSS
      let reportDataByJrss: any = [];
      this.reportData.forEach((item) => {
        if (item[0][1].toLowerCase().startsWith(jrss.toLowerCase())) {
          reportDataByJrss.push(item);
        }
      });
     
      this.reportData = reportDataByJrss;
      console.log("reportData:" +this.reportData[0]);
      this.dataSource.data = this.reportData as ReportStats[];
    } 
  }
// ****************************** end of getter and setter methods **********************************


  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'row[0][1]': return item[0][1];
          case 'row[1][1]': return item[1][1];
          case 'row[2][1]': return item[2][1];
          case 'row[3][1]': return item[3][1];
          case 'row[4][1]': return item[4][1];
          case 'row[5][1]': return item[5][1];
          case 'row[6][1]': return item[6][1];
          default: return property;
        }
     };
    this.loadReportData();
    
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


// ************** Get all initial report data for all the JRSS, with no filters ******************** 
loadReportData() {
  //let accountArr = this.account.split(",");
  //for(let i=0; i<accountArr.length; i++){
 //   accountArr.forEach(acc =>{
  this.reportService.getReport(this.account).subscribe(res => {
    let report_data = res;
    console.log("res:"+JSON.stringify(report_data));
    res.forEach((item) => {
      this.reportResponse.push(item._id)
     });

    this.reportResponse.sort((a, b) => a.JRSS.localeCompare(b.JRSS));
    //The search filter, will have no impact on loading initial data 
    //No data will be filtered 
    this.searchFilter();

  }, (error) => {
    console.log(error);
  })
//})
} //end of loadreportData()

  //*************** Filter by from Date and To Date method ************* 
  searchFilter() {
    console.log("search filter");
    let stage1Count = 0;
    let stage3Count = 0;
    let stage4Count = 0;
    let stage5Count = 0;
    let toDate: any;
    let fromDate: any;
    

    let totalRegCandiates = 0;
    this.reportData = [];
    this.reportObj = {};
    if (!this.from_Date) {
      fromDate = Date.parse("1000-01-01");
    } else {
      fromDate = Date.parse(this.from_Date);
    }
    if (!this.to_Date) {
      toDate = Date.parse("9999-01-01");
    } else {
      toDate = Date.parse(this.to_Date);
    }


    this.reportResponse.forEach((item) => {

      let registeredDate = Date.parse(item.createdDate.split('T')[0]);

      if (registeredDate >= fromDate && registeredDate <= toDate) {
        if (this.reportObj[item.JRSS]) {
         console.log("JRSS filter",item.JRSS);
          stage1Count = this.reportObj[item.JRSS].stage1Count;
          stage3Count = this.reportObj[item.JRSS].stage3Count;
          stage4Count = this.reportObj[item.JRSS].stage4Count;
          stage5Count = this.reportObj[item.JRSS].stage5Count;
          totalRegCandiates = this.reportObj[item.JRSS].totalRegCandiates + 1;

        } else {
          totalRegCandiates = 1;
          stage1Count = 0;
          stage3Count = 0;
          stage4Count = 0;
          stage5Count = 0;
        }

        item.stage1_status.forEach((stage1Status) => { if (stage1Status == 'Completed') stage1Count++ });
        item.stage3_status.forEach((stage3Status) => { if (stage3Status == 'Completed') stage3Count++ });
        item.stage4_status.forEach((stage4Status) => { if (stage4Status == 'Completed') stage4Count++ });
        item.stage5_status.forEach((stage5Status) => { if (stage5Status == 'Completed') stage5Count++ });

        if(this.loginAccounts.length > 1 || this.account === 'SECTOR'){
        this.reportObj[item.JRSS] = {
          "JRSS": item.JRSS, "account": item.account,
          "totalRegCandiates": totalRegCandiates,
          "stage1Count": stage1Count, "stage3Count": stage3Count,
          "stage4Count": stage4Count, "stage5Count": stage5Count,
          
        };
      }
      else if(this.loginAccounts.length <= 1 || this.account !== 'SECTOR'){
        this.reportObj[item.JRSS] = {
          "JRSS": item.JRSS, 
          "totalRegCandiates": totalRegCandiates,
          "stage1Count": stage1Count, "stage3Count": stage3Count,
          "stage4Count": stage4Count, "stage5Count": stage5Count,
          
        };
      }
      }

    }); //end of reportResponse for loop

    this.dataSource.data = [];
    Object.keys(this.reportObj).forEach((key) => {
      this.reportData.push(Object.entries(this.reportObj[key]));
      this.dataSource.data = this.reportData as ReportStats[];
      console.log("Datasource data"  +this.dataSource.data);
    });
  }

  applyFilter(filterValue: string,key: string) {
    this.filterObj = {
          value: filterValue.trim().toLowerCase(),
          key: key
    }
   this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}