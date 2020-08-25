import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute } from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // animation triggers go here
  ]
})
export class AppComponent {
  title = 'swipr';
  lang: string;
  constructor(public translate: TranslateService, private activatedRoute: ActivatedRoute) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');

    this.activatedRoute.queryParams.subscribe(params => {
      // console.table(params);
      this.lang = params["lang"];
      if(this.lang != null)
      this.translate.setDefaultLang(this.lang);
      
      console.log("Language Selected: "+this.lang);
    })
  }
}
