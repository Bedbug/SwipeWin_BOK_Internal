import { Component, OnInit } from '@angular/core';
import {  DataService } from  '../data.service';
import { Router } from '@angular/router';
import {  Observable } from 'rxjs';
import { SessionService } from '../session.service';
 
@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss']
})
export class WinnersComponent implements OnInit {
  
  winners$: Array<any>;
  public dailyWinners$: Array<any> = [];
  public monthlyWinners$: Array<any> = [];
  showDay: boolean = true;
  sliceNum: number = 5;
  isActive: boolean;
  _gamesPlayed: number;
  
  
  
  constructor(private data: DataService, private sessionService: SessionService, private router: Router,) { }
 
  
  doAlert(){
      this.showDay = !this.showDay;
      console.log(this.showDay); // black
    }
  
  ngOnInit() {
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      this.isActive = true;
      
    }else{
      this.isActive = false;
      this._gamesPlayed = this.sessionService.gamesPlayed;
    }

    this.data.getWinners().then(
        (data:any) => {
          
          this.dailyWinners$ = data.dailyWinners;
          
          console.log(this.dailyWinners$);
          
          
          if(this.dailyWinners$ == null || this.dailyWinners$.length == 0)
            this.dailyWinners$ = [{id: "", username: "", msisdn: "", winDate: "", winSum: ""},{id: "", username: "", msisdn: "", winDate: "", winSum: ""},{id: "", username: "", msisdn: "", winDate: "", winSum: ""},{id: "", username: "", msisdn: "", winDate: "", winSum: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},
            {id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""}];
          
          else if(this.dailyWinners$[0].winDate != ""){
            for( var i = 0; i < this.dailyWinners$.length; i++) {
              var newDate = this.formatDate(this.dailyWinners$[i].winDate)
              this.dailyWinners$[i].winDate = newDate.toString();
            }
          } else {
            this.dailyWinners$ = [{id: "", username: "", msisdn: "", winDate: "", winSum: ""},{id: "", username: "", msisdn: "", winDate: "", winSum: ""},{id: "", username: "", msisdn: "", winDate: "", winSum: ""},{id: "", username: "", msisdn: "", winDate: "", winSum: ""},
            {id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},
            {id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},
            {id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""}];
          }
          
          
          this.monthlyWinners$ = data.monthlyWinners$;
          console.log(this.monthlyWinners$);
          if(this.monthlyWinners$ == null)
            this.monthlyWinners$ = [{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""},{id: "", username: "", msisdn: "", winDate: ""}];
          
          if(this.monthlyWinners$ ==  null)
            this.monthlyWinners$ = [];
            else if(this.monthlyWinners$[0].winDate != "") {
              for( var i = 0; i < this.monthlyWinners$.length; i++) {
                var newDate = this.formatDate(this.monthlyWinners$[i].winDate)
                this.monthlyWinners$[i].winDate = newDate.toString();
              }
            }
        },
        (err) => {
          console.error(err);
        }
      );
      
  }


  formatDate(stringDate){
    var date = new Date(stringDate);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
  }

  public subscribe($event) {
    console.log('button is clicked');
    $event.stopPropagation();
    this.router.navigate(['/home']);
  }
  
  startGame() {
      console.log("Play Main Game!");
      this.sessionService.gamesPlayed++;
      this.router.navigate(['game']);
    
  }
  
  startFreeGame() {
    this.router.navigate(['freetimegame']);
  }
  goHomeWithLogin() {
    console.log("Goto Return Home!");
    localStorage.setItem('loginOn', "1");
    this.router.navigate(['home']);
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
