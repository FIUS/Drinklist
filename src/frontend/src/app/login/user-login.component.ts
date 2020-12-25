import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {LocaleService} from '../services/locale.service';
import {ActivatedRoute, Router} from '@angular/router';

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
        <form #loginForm='ngForm'>
          <!-- Hidden username field for accesibility https://goo.gl/9p2vKq -->
          <input hidden type="text" name="username" autocomplete="username">

          <label for="password">{{localeService.getMessage('plabel')}}</label>
          <input class="form-control" name="password" autocomplete="current-password" type="password" placeholder="********" autofocus
                 [(ngModel)]="password">
        </form>
      </div>
    </main>
  `,
  styles: []
})
export class UserLoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public localeService: LocaleService,
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
          this.error = `${this.localeService.getMessage('loginFail')}: ${this.localeService.getMessage(reason)}`;
        }));
    }
  }

}
