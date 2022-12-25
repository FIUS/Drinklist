import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from './services/auth.service';
import {LocaleService} from './services/locale.service';
import {ILocale} from './models/i-locale';
import {faCogs, faInfo, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
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
    this.localeService.getLocales().subscribe((locales) => {
      this.locales = locales;
    });
    this.selectedLocale = this.localeService.activeLocale;

    this.title.setTitle(AppConfig.config.title);
  }

  isAdminRoute(): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path?.split('/')[0] === 'admin';
  }

  logout(): void {
    this.authService.logout();
  }

  setLocale(): void {
    this.localeService.activeLocale = this.selectedLocale || '';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedInAsRole(this.isAdminRoute() ? 'admin' : 'user');
  }

  showImprintBtn(): boolean {
    return AppConfig.config.imprint;
  }

  showPrivacyBtn(): boolean {
    return AppConfig.config.dataProtection;
  }
}
