import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService, LoginError} from '../services/auth.service';
import {LocaleService} from '../services/locale.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-user-login',
  template: `
    <header class="text-center">
      <h1 class="display-1">
        {{localeService.getMessage('header01')}}
        <small class="text-muted">{{localeService.getMessage('header02')}}</small>
      </h1>
    </header>
    <main>
      <div class="container" style="margin-top: 10vh">
        <form #loginForm="ngForm">
          <!-- Hidden username field for accessibility https://goo.gl/9p2vKq -->
          <input hidden type="text" name="username" autocomplete="username">

          <label for="password">{{localeService.getMessage('plabel')}}</label>
          <input class="form-control" name="password" autocomplete="current-password" type="password" placeholder="********" autofocus
                 [(ngModel)]="password">
          <div class="alert alert-danger mt-3" *ngIf="error">{{error}}</div>
        </form>
      </div>
    </main>
  `,
  styles: []
})
export class UserLoginComponent implements OnInit {
  @ViewChild('loginForm', {static: true}) private loginForm: NgForm | undefined;

  constructor(
    public localeService: LocaleService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  public password = '';

  public error: string | undefined;

  ngOnInit(): void {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.password.length > 0) {
      this.authService.login(this.password.trim())
        .then(() => {
          const returnTo = this.route.snapshot.queryParamMap.get('returnTo')?.substring(1) || '';
          this.router.navigateByUrl('/' + returnTo);
        })
        .catch((reason => {
          if (reason === LoginError.WRONG_PASSWORD) {
            this.loginForm?.resetForm();
          }
          this.error = `${this.localeService.getMessage('loginFail')}: ${this.localeService.getMessage('loginFail' + reason)}`;
        }));
    }
  }

}
