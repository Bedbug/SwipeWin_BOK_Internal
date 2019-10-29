import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import UIkit from 'uikit';

@Component({
  selector: 'app-returnhome',
  templateUrl: './returnhome.component.html',
  styleUrls: ['./returnhome.component.scss']
})

export class ReturnhomeComponent implements OnInit {

  get hasCashback(): number {
    return this._cashBackAmount;
  }
  get isSubscribed(): boolean {
    return this._isSubscribed;
  }
  
  get isChecked(): boolean {
    return this._isChecked;
  }
  
  get gamesPlayed(): number {
    return this._gamesPlayed;
  }
  
  // Check if already a subscribed player
  private _isSubscribed = false;
  // Check if he has cashback waiting
  public _cashBackAmount = 0;
  // Check if check is checked so he can click the button
  private _isChecked = false;
  // How many (1st free or billable) games the user has played
  public _gamesPlayed = 0;

  public errorMsg = "";
  public noMoreRealGames = "Unfortunately, your current plan is not allowed to participate.\nTry using another number.";
  public noMoreDemoGames = "No more demo games available! \n Why don't you try the real thing?";

  checkCheckBoxvalue(event){
    console.log(event.target.checked);
    this._isChecked = event.target.checked;
  }
  
  GoSubscribe() {
    
  }

  OpenSureModal() {
    var modal = UIkit.modal("#areUSure");
    //   this.errorMsg = this.noMoreRealGames;
    modal.show();
  }
  OpenMainModal() {
    var modal = UIkit.modal("#result");
    //   this.errorMsg = this.noMoreRealGames;
    modal.show();
  }

  startGame() {
    console.log("Games Played: "+ this.gamesPlayed);
    
    // if(this._gamesPlayed >= 3) {
    //   // popup modal with error
    //   var modal = UIkit.modal("#error");
    //   this.errorMsg = this.noMoreRealGames;
    //   modal.show();
      
    // }else{
      console.log("Play Main Game!");
      this.sessionService.gamesPlayed++;
      this.router.navigate(['game']);
      // this.router.navigate(['freetimegame']);
    // }
  }
  
  startFreeGame() {
    this.router.navigate(['freetimegame']);
  }

  public playDemoGame($event) {
    console.log('Demo button is clicked');
    
    if (!this.sessionService.gameSettings || !this.sessionService.gameSettings.maintenance || this.sessionService.gameSettings.maintenance.siteDown || this.sessionService.gameSettings.maintenance.noGames)
      return;
      
    // // this.router.navigate(['demogame']);
    // this.demoGamesPlayed = +localStorage.getItem('demoGamesPlayed');
    // // Check games count
    // console.log("demoGamesPlayed "+ this.demoGamesPlayed);
    // if(this.demoGamesPlayed >= 2) {
    //   // popup modal with error
    //   var modal = UIkit.modal("#error");
    //   this.errorMsg = this.noMoreDemoGames;
    //   modal.show();
      
    // }else{
    //   // Add one and play the demo game
    //   this.demoGamesPlayed++;
    //   localStorage.setItem('demoGamesPlayed', this.demoGamesPlayed.toString());
    //   localStorage.setItem('lastDemoPlayed', (new Date()).toString() );
    //   // this.router.navigate(['demogame']);
      this.router.navigate(['demogame']);
    // }
    
  
    
  }

  constructor(private dataService: DataService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    // user login validation check
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      
      // Redirect him to Home
      this.router.navigate(['/home'], { queryParams: { errorCode: 401 } });
    }
    else if (!this.sessionService.isEligible) {
      this.router.navigate(['/home'], { queryParams: { errorCode: 1026 } });
      
      
    }
    else {
      this._isSubscribed = this.sessionService.isSubscribed;
      console.log(this.sessionService.msisdn);
      console.log("this.session "+this.sessionService.token);
      // this._cashBackAmount = this.sessionService._cashBackAmount;
      // this._cashBackAmount = 500;
      
      // TOBE ERASED
      // This resets the games played every time
      
      
      this.dataService.getUserProfile().then( 
        (data:User) => {
          this.sessionService.user = data;
          this._gamesPlayed = this.sessionService.gamesPlayed;
          
          console.log("this._gamesPlayed "+this._gamesPlayed);
          console.log("this.sessionService.gamesPlayed "+this.sessionService.gamesPlayed);
          // this._gamesPlayed = 3;
          // this._cashBackAmount = this.sessionService.user.wallet.pendingMaturityCashback + this.sessionService.user.wallet.pendingTransferCashback;
        },
        (err) => {
          
        }
        
      );
    }
  }

}
