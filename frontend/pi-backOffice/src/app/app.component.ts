import { Component } from '@angular/core';
import { Authentication } from './service/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pi-backOffice';

  constructor(
    private consumer: Authentication,
    private translateService: TranslateService
  ) {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const languageCode = savedLanguage || 'fr';
    this.translateService.setDefaultLang(languageCode);
    this.translateService.use(languageCode);
  }

  ngOnInit() {
    this.consumer.autoLogin();
  }
}
