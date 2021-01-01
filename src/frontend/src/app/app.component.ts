import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from './services/auth.service';
import {LocaleService} from './services/locale.service';
import {ILocale} from './models/i-locale';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import {faCogs} from '@fortawesome/free-solid-svg-icons/faCogs';
import {faInfo} from '@fortawesome/free-solid-svg-icons/faInfo';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {AppConfig} from './app.config';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public localeService: LocaleService,
    private route: ActivatedRoute,
    private title: Title,
  ) {
  }

  locales: ILocale[] = [];
  selectedLocale: string | undefined;

  // FontAwesome icons
  faSignOutAlt = faSignOutAlt;
  faCogs = faCogs;
  faInfo = faInfo;
  faUser = faUser;

  ngOnInit(): void {
    this.localeService.getLocales().then((locales) => {
      this.locales = locales;
    });
    this.selectedLocale = this.localeService.activeLocale;

    this.title.setTitle(AppConfig.config.settings.title);
  }

  isAdmin(): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path?.split('/')[0] === 'admin';
  }

  logout(): void {
    this.isAdmin() ? this.authService.logoutAdmin() : this.authService.logoutUser();
  }

  setLocale(): void {
    this.localeService.activeLocale = this.selectedLocale || '';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(this.isAdmin() ? 'admin' : 'user');
  }

  showImprintBtn(): boolean {
    return AppConfig.config.settings.imprint;
  }

  showPrivacyBtn(): boolean {
    return AppConfig.config.settings['data-protection'];
  }
}
