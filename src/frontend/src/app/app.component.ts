import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from './services/auth.service';
import {LocaleService} from './services/locale.service';
import {ILocale} from './models/ilocale';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import {faCogs} from '@fortawesome/free-solid-svg-icons/faCogs';
import {faInfo} from '@fortawesome/free-solid-svg-icons/faInfo';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';

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
  ) {
  }

  locales: ILocale[] = [];
  selectedLocale: string | undefined;

  // FontAwesome icons
  faSignOutAlt = faSignOutAlt;
  faCogs = faCogs;
  faInfo = faInfo;
  faP = faUser;

  ngOnInit(): void {
    this.localeService.getLocales().then((locales) => {
      this.locales = locales;
    });
    this.selectedLocale = this.localeService.activeLocale;

    this.isAdmin();
  }

  isAdmin(): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path === 'admin';
  }

  logout(): void {
    this.isAdmin() ? this.authService.logoutAdmin() : this.authService.logoutUser();
  }

  setLocale(): void {
    this.localeService.activeLocale = this.selectedLocale || '';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn('any');
  }
}
