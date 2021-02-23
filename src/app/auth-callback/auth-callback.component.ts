import { Component, OnInit } from '@angular/core';
import { DefaultUrlSerializer, Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UrlTree } from '@angular/router';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private location: Location, 
    private dataService: DataService,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit() {
    var urlSer= new DefaultUrlSerializer();
    console.log('incoming path: ' + this.location.path());
    var urlTree: UrlTree = urlSer.parse(this.location.path());
    
    //const urlParams = new URLSearchParams(window.location.href);
    const result: String = urlTree.queryParams['result'];
    const subscriptionId: String = urlTree.queryParams['subscription_id'];
    const msisdn: String = urlTree.queryParams['msisdn'];
    const that = this;

    const orderid: String  = urlTree.queryParams['ORDERID']; 
    console.log("ORDER ID: "+ orderid);
    
    /*
    this.dataService.authenticateUserToken(code).subscribe(
        data => {
            const msisdn = '7' + data['mobile:phone'];
            this.sessionService.msisdn = msisdn;
            this.sessionService.mtsToken = data['accessToken'];
            this.sessionService.Serialize();
            
            this.checkUserSubscription();
        },
        err => {
          console.log("This");
            that.router.navigate(['/home'], { queryParams: { errorCode: 1010 } });
        }
    );
    */

    // Load the game settings
    this.dataService.fetchGameSettings().then(
      (data: any) => {
        this.sessionService.gameSettings = data;
        this.checkUserSubscription(msisdn, subscriptionId);
      },
      (err: any) => {
      });

    
  }

  checkUserSubscription(msisdn: String, subId: String) {
    this.dataService.authenticateCallback(msisdn, subId).subscribe(resp => {
    
      // Get JWT token from response header and keep it for the session
      const userToken = resp.headers.get('X-Access-Token');
      if (userToken)  // if exists, keep it
          this.sessionService.token = userToken;
          
      // Deserialize payload
      const body: any = resp.body; // JSON.parse(response);
      // console.table(body);
      if (body.isEligible !== undefined)
        this.sessionService.isEligible = body.isEligible;
      if (body.isSubscribed != undefined)
        this.sessionService.isSubscribed = body.isSubscribed;
      if (body.gamesPlayedToday !== undefined)
        this.sessionService.gamesPlayed = body.gamesPlayedToday;
      if (body.hasCredit !== undefined)
        this.sessionService.hasCredits = body.hasCredit;

      // Update the user State
      this.sessionService.state = body.state;
      // console.log(this.sessionService.state);
      // console.log("Checking Credits: "+ this.sessionService.hasCredit());

      if (body.credits > 0)
        this.sessionService.credits = body.credits;

      // Goto the returnHome page
      this.router.navigate(['/returnhome']);
    },
    err => {
      this.router.navigate(['/home'], { queryParams: { errorCode: 1010 } });
    });
  }

}
