import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { LocalizationService } from '../localization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import UIkit from 'uikit';
import { createPipeInstance } from '@angular/core/src/view/provider';
import { debug } from 'util';
import { TranslateService } from '@ngx-translate/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { environment } from '../../environments/environment';


// import * as libphonenumber from 'google-libphonenumber';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginOn: number;
  AutoLogin: boolean;
  openVerify: boolean;
  lblShow:boolean = true;
  passType: string = "password";
  loggedin: boolean;
  credits: number;
  gamesPlayed: number;
  openSubSuccess: boolean = false;
  alertNumber: boolean = false;
  verErrorMes: boolean = false;
  acceptCheck: boolean = false;

  // get this form the User object
  get isHasCashback(): boolean {
    return this._isHasCashback;
  }
  
  // get this form the User objectusername
  get isSubscribed(): boolean {
    return this._isSubscribed;
  }

  public _isSubscribed = true;
  private _isHasCashback = false;
  public demoGamesPlayed = 0;
  public errorMsg = "";
  public noMoreRealGames = this.translate.instant('MESSAGES.MESSAGE_08');
  public noMoreDemoGames = this.translate.instant('MESSAGES.MESSAGE_09');
  public authError = this.translate.instant('MESSAGES.MESSAGE_10');
  public logOut = this.translate.instant('MESSAGES.MESSAGE_11');
  public blackListed = this.translate.instant('MESSAGES.MESSAGE_12');
  public noCredits = this.translate.instant('MESSAGES.MESSAGE_13');
  public isSubedText = this.translate.instant('MESSAGES.MESSAGE_18');

  
  public logOutBtn = true;
  public gotofaqBtn = false;
  
  public lastDemoPlayed : Date;
  public now: Date = new Date();
  
  public showLogin = false;
  public newLogin = true;

  lang: string;
  // Lottie
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  public showConfirm: boolean = false;
  
  constructor(
    private dataService : DataService, 
    private sessionService: SessionService,
    private localizationService: LocalizationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private translate: TranslateService
    
    ) {}
    
  
  ngOnInit() {

    // Get Login On From LocalStorage
    this.loginOn = 0;
    this.openSubSuccess = false;


    // Detect if a unique link exists in the home path
    // implemented after https://medium.com/@tomastrajan/how-to-get-route-path-parameters-in-non-routed-angular-components-32fc90d9cb52
    let msisdnCode;
    let errorCode = null;


    this.activatedRoute.paramMap.subscribe((params) => {
      const code = params.get('msisdnCode');
      if (code !== 'home')
        msisdnCode = code;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      errorCode = params["errorCode"];
    });


    // Load the game settings
    this.dataService.fetchGameSettings().then(
      (data: any) => {
        this.sessionService.gameSettings = data;
        this.localizationService.init(this.sessionService.gameSettings.localization);
        let modal = UIkit.modal("#error");

        // Determine if an error code sent navigation to this state, then display the appropriate message
        if (errorCode) {
          switch (errorCode) {
            case '401': this.errorMsg = this.authError; this.logOutBtn = true; this.gotofaqBtn = true; console.log('401'); break;
            case '1010': this.errorMsg = this.authError; this.logOutBtn = true; this.gotofaqBtn = true; console.log('1010'); break;
            case '1026': this.errorMsg = this.blackListed; this.logOutBtn = true; this.gotofaqBtn = true; console.log('1026'); break;
            case '1023': this.errorMsg = this.noMoreRealGames; this.gotofaqBtn = false; this.logOutBtn = false; break;
            case '1021': this.errorMsg = this.noCredits; this.gotofaqBtn = false; this.logOutBtn = false; break;
            case '1025': this.errorMsg = this.noCredits; this.gotofaqBtn = false; this.logOutBtn = false; break;
          }

          if (this.sessionService.user)
            this.sessionService.reset();

          if (this.errorMsg !== '' && modal != null) {
            modal.show();
          }

        } else if (msisdnCode) {// Else, Determine if this is the mobile/Ussd/Sms user flow or the WiFi one
          // Mobile/Ussd/Sms flow here
          // console.log('Mobile /SMS /USSD user flow');
          this.AutoLogin = true;

          this.dataService.authenticateSSO(msisdnCode).subscribe((resp: any) => {

            // Get JWT token from response header and keep it for the session
            const userToken = resp.headers.get('X-Access-Token');
            if (userToken)  // if exists, keep it
              this.sessionService.token = userToken;

            // Deserialize payload
            const body: any = resp.body; // JSON.parse(response);
            console.table(body);

            if (body.isEligible !== undefined)
              this.sessionService.isEligible = body.isEligible;
            if (body.isSubscribed != undefined)
              this.sessionService.isSubscribed = body.isSubscribed;
            if (body.gamesPlayedToday !== undefined)
              this.sessionService.gamesPlayed = body.gamesPlayedToday;
            if (body.hasCredit !== undefined)
              this.sessionService.hasCredits = body.hasCredit;

            // console.log("hasCredit: " + body.hasCredit);
            // Update the user State
            this.sessionService.state = body.state;
            
            console.log(this.sessionService.state);
            // console.log("Checking Credits: "+ this.sessionService.hasCredit());

            if (body.credits > 0)
              this.sessionService.credits = body.credits;

            // console.log("hasCredit: " + this.sessionService.hasCredit());


            // Chage view state
            this.loggedin = true;
            this.openVerify = false;
            // if(!this.sessionService.isUnsub)
            this.router.navigate(['/returnhome']);
            // else{
            //   this.openSubSuccess = true;
            //   this.newLogin = true;
            // }

          },
            (err: any) => {
              this.AutoLogin = false;
              this.router.navigate(['/home']);
            });
        }

        else {
          // MTN consent flow here
          // this.redirect();
        }
      },
      (err: any) => {
      });

    // Check AutoLogin or NOt
    this.AutoLogin = false;
    this.openVerify = false;
    this.loggedin = false;
  }


  public redirect(): void {
    this.dataService.getDocument().location.href = environment.mtnAuthDomainUrl;
  };

  public checkCheckBoxvalue(event: any){
    // console.log(event.currentTarget.checked);
    this.acceptCheck = event.currentTarget.checked;
    // console.log(this.acceptCheck);
  }
  
 
 
  public playGame($event) {
    // console.log('button is clicked');
    // $event.stopPropagation();
    this.showLogin = true;
  }
  
  logOutUser() {
    // console.log("LoggingOut!");
    const allCookies: {} = this.cookieService.getAll();
    // console.log(allCookies);
    this.cookieService.deleteAll('/');
    // Trying the updated MTS logout redirect with the logout parameter
    this.sessionService.reset();
    this.router.navigate(['/home']);
    // this.dataService.logoutRedirect();
    
  }
  
  gotoFaqPage() {
    this.logOutUser();
    this.router.navigate(['/faq']);
  }

  onKey(event: any){
    // console.log(event.target.value);
    // const phoneNumber = parsePhoneNumberFromString(event.target.value, 'ZA');
    // // console.log(phoneNumber.);
    // // console.log(phoneNumber.formatNational());
    // if(phoneNumber!=null)
    //   event.target.value = phoneNumber.formatInternational();
  }
  
  submit(number: string) {

    this._isSubscribed = false;
    

    if (!this.sessionService.msisdn)
      this.sessionService.msisdn = number;

    // Run or Go to returnHome
    // this.router.navigate(['/auth-callback'], { queryParams: { code: number } });

    this.dataService.authenticate(number).subscribe((resp: any) => {


      // Deserialize payload
      const body: any = resp.body; // JSON.parse(response);
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
      if(!body.isEligible){
        this.alertNumber = true;
        console.log("Open Error Message!");
        
      }
      // console.log("Is Subed: "+ this.sessionService.isSubscribed);
      // this.openVerify = true;

      // If present, Get JWT token from response header and keep it for the session
      const userToken = resp.headers.get('X-Access-Token');
      if (userToken) { // if exists, keep it
        this.sessionService.token = userToken;
        this.sessionService.Serialize();

        console.log("Goto ReturnHome!!!");
        
        // Goto the returnHome page
        this.router.navigate(['/returnhome']);
        // this.openSubSuccess = true;
        // console.log("Open Happy Modal!");
        // let modalUnique = UIkit.modal("#happy");
        // modalUnique.show();
        
        // this.newLogin = true;
      }else{
        console.log();
        
        this.verErrorMes = true;
      }
    },
      (err: any) => {
        // console.log(err.error.errorCode);
        if (err.error.errorCode == 1002 || err.error.errorCode == 1006) {
          // console.log(err.error.errorCode);
          this.errorMsg = this.isSubedText;
          let modal = UIkit.modal("#error");
          modal.show();
        }
      });

    
  }


  verify(pass: string) {

    // console.log("username: " + this.sessionService.msisdn);
    // console.log("password: " + pass);

    this.dataService.authenticateVerify(this.sessionService.msisdn, pass).subscribe((resp: any) => {

      // Get JWT token from response header and keep it for the session
      const userToken = resp.headers.get('X-Access-Token');
      if (userToken)  // if exists, keep it
        this.sessionService.token = userToken;

      // Deserialize payload
      const body: any = resp.body; // JSON.parse(response);
      // console.table("body: "+ body);
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
      // // this.sessionService.hasCredits = true;
      // console.log(this.sessionService.state);
      // console.log("body.hasCredit: " + body.hasCredit);
      // console.log("this.sessionService.hasCredits: " + this.sessionService.hasCredits);
      // console.log("hasCredist() "+ this.sessionService.hasCredit());
      // console.log("hasCredit: " + this.sessionService.hasCredit());
      // if (body.bestScore !== undefined) {
      //   if (!this.sessionService.user)
      //     this.sessionService.user = new User();
      //   this.sessionService.user.bestScore = body.bestScore;
      // }

      // console.log("User Best Score: "+this.sessionService.user.bestScore);
      //this.sessionService.Serialize();

      // Chage view state
      this.loggedin = true;
      this.openVerify = false;
      this.openSubSuccess = true;

      // this.CheckCredits();
      // Goto the returnHome page
      //this.router.navigate(['/returnhome']);
    },
      (err: any) => {
        // console.log("Error With Pin!!!");
       this.verErrorMes = true;
      });

    // Run or Go to returnHome
    //this.router.navigate(['/auth-callback'], { queryParams: { code: user } });
  }

  verifyDirect(pass: string) {

    // console.log("username: " + this.sessionService.msisdn);
    console.log("password: " + pass);

    this.dataService.authenticate(pass).subscribe((resp: any) => {

      // Get JWT token from response header and keep it for the session
      const userToken = resp.headers.get('X-Access-Token');
      if (userToken)  // if exists, keep it
        this.sessionService.token = userToken;

      // Deserialize payload
      const body: any = resp.body; // JSON.parse(response);
      if (body.isEligible !== undefined)
        this.sessionService.isEligible = body.isEligible;
      if (body.isSubscribed != undefined)
        this.sessionService.isSubscribed = body.isSubscribed;
      if (body.gamesPlayedToday !== undefined)
        this.sessionService.gamesPlayed = body.gamesPlayedToday;
      if (body.hasCredit !== undefined)
        this.sessionService.hasCredits = body.hasCredit;

      //this.sessionService.Serialize();

      // Chage view state
      // this.loggedin = true;
      // this.openVerify = false;
      // this.openSubSuccess = true;
      // if(!this.sessionService.isUnsub)
      //     this.newLogin = false;
      //   else
      //     this.newLogin = true;

      // console.log("Open Happy Modal!");
      // let modalUnique = UIkit.modal("#happy", {escClose: false, bgClose: false});
      // modalUnique.show();
    },
      (err: any) => {
        // console.log("Error With Pin!!!");
        this.verErrorMes = true;
      });

    // Run or Go to returnHome
    //this.router.navigate(['/auth-callback'], { queryParams: { code: user } });
  }


  sendUniqueLink() {
    this.dataService.requestPin().then((resp: any) => {
      // console.log('Reset password is successful');
    });
  }

  

  GotoReturnHome() {
    this.router.navigate(['returnhome']);
  }

  PlayGame() {
    // console.log("Burn One Credit, Play Game!");
    this.dataService.getUserProfile().then( 
      (data:User) => {
        this.sessionService.user = data;
        // console.log("this.sessionService.gamesPlayed "+this.sessionService.gamesPlayed);

      this.sessionService.gamesPlayed++;
      this.router.navigate(['game']);
        
      },
      (err) => {
        
      });

      
  }
  

  VerifyLogPin(pin:string) {
    // console.log("Verify PIN & login User!");
    this.loggedin = true;
    // Check Credits
    // this.CheckCredits();
    this.router.navigate(['returnhome']);
  }

  CheckCredits() {
   
  }

  OpenPass(){
    this.lblShow = !this.lblShow;
    // console.log("Hide/Show Password: " + this.lblShow);
    if(this.lblShow)
      this.passType = "password";
    else
      this.passType = "test";
  }
  
  

}
