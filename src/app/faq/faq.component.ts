import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  
   public isActive: boolean = false;
   public _gamesPlayed = 0;
   
  constructor(private dataService : DataService, private sessionService: SessionService, private router: Router ) { }

 
  ngOnInit() {
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      this.isActive = true;
      
    }else{
      this.isActive = false;
      this._gamesPlayed = this.sessionService.gamesPlayed;
    }
    
    
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
  
}
