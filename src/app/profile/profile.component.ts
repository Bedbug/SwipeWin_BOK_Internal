import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { environment } from '../../environments/environment';
//import { User } from '../../models/User';
import UIkit from 'uikit';

const VIEW_STATES = {
  PROFILE: 'SHOW_PROFILE',
  SETTINGS: 'SHOW_SETTINGS',
};


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  get bestResultToday(): number {
    return this._bestResultToday;
  }
  get totalGamesCount(): number {
    return this._totalGamesCount;
  }
  get bestResultAllTime(): number {
    return this._bestResultAllTime;
  }
  get totalPoints(): number {
    return this._totalPoints;
  }
  
  get getCahback(): number {
    return this._cashBackAmount;
  }
  
  public _phone = "+7 (000) 000-00-00";
  private _totalGamesCount = 0;
  private _bestResultAllTime = 0;
  private _bestResultToday = 0;
  public _cashBackAmount = 0;
  public _daysInGame = 0;
  public _username = "Empty";
  public _totalPoints = 0;
  public showAvatar = true;
  
  public avatarPic="assets/images/avatar.svg";
  public userName="themis brink";
  
  public _totalDays;
  
  private state = VIEW_STATES.PROFILE;

  public errorMsg = "";
  // public showSettingsView = () => this.state = VIEW_STATES.SETTINGS;

  public isSettingsShowable = () => this.state === VIEW_STATES.SETTINGS;
  
  constructor(
    private dataService: DataService, 
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit() {
    // this.state = VIEW_STATES.PROFILE;
    
    // user login validation check
    if (!this.sessionService.token || !this.sessionService.isEligible) {
      // wanna inform the user here?
      //this._cashback = this.sessionService.cashback;
      // Initiate user authentication
      // this.dataService.authenticateRedirect();
      let modal = UIkit.modal("#error");
      this.errorMsg = "Вы должны подписаться, чтобы войти в этот раздел";
      modal.show();
    }
    else {
      this.dataService.getUserProfile().then( 
        (data:User) => {
          console.log(data);
          
          this.sessionService.user = data;
          this.userName = data.username;
          this._totalGamesCount = data.gamesPlayed;
          this._bestResultAllTime = data.bestScore;
          this._bestResultToday = data.bestScoreToday;
          this._daysInGame = data.totalDaysPlaying;
          this._username = data.username;
          this._totalPoints = data.totalPoints ;

          console.log(data.username);
          console.log("Total Points:"+ data.totalPoints);
          
          if(this._daysInGame == null)
            this._daysInGame = 0;
            

          this._totalGamesCount = 1 - this.sessionService.gamesPlayed;
          if(this._totalGamesCount<0) this._totalGamesCount = 0;
          // this._totalDays = data.totalDaysPlaying;
          // this._cashBackAmount = data.wallet.pendingMaturityCashback + data.wallet.pendingTransferCashback;
          
          if( data.picture != null ){
            this.avatarPic = environment.gameServerDomainUrl + '/' + data.picture;
          }else{
            this.avatarPic = "assets/images/avatar.svg";
          }
          
          
          // console.log()
          
          // if(this.avatarPic == null && this.userName == null) {
            
            
          // }
          this.refreshDiv();
          this._phone = data.msisdn;
          // console.log(this.sessionService.user);
        },
        (err) => {
          
        }
        
      );
    }
  }
  
  refreshDiv(){
    console.log("Refreshing Avatar!!!");
    this.showAvatar = false;
    setTimeout(()=>{
          this.showAvatar = true
          }, 50);

  }
  
  showSettingsView() {
    this.router.navigate(['settings']);
  }
  
  gotoCashback() {
      this.router.navigate(['cashback']);
  }
  
  goHome() {
    if (!this.sessionService.token || !this.sessionService.isEligible) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['/returnhome']);
    }
  }
    
}
