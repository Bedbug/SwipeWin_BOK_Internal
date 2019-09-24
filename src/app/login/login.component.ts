import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private dataService: DataService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    
     if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      // Initiate user authentication
      //this.dataService.authenticate('msisdn','pin');
    } else {
      this.router.navigate(['/returnhome']);
    }
    
  }

}
