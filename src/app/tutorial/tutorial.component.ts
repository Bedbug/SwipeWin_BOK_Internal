import { Component, OnInit } from '@angular/core';
import {Globals} from '../globals';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  private isFirstDemo: boolean;
  
  constructor(private globals: Globals, private sessionService: SessionService,) { 
    this.isFirstDemo = globals.isFirstDemo;
  }

  ngOnInit() {
    console.log("Change globals.isFirstDemo to: "+ this.globals.isFirstDemo);
  }
  
  changeTutorialFlag() {
    this.sessionService.gamesPlayed++;
    this.isFirstDemo = false;
    this.globals.isFirstDemo = this.isFirstDemo;
    console.log("Change isFirstDemo to: "+ this.isFirstDemo);
    console.log("Change globals.isFirstDemo to: "+ this.globals.isFirstDemo);
  }

}
