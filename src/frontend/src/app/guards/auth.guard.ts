import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  private redirectToLogin(type: 'user' | 'admin', returnTo: string): boolean {
    let url: string;
    switch (type) {
      case 'user':
        if (returnTo === '/') {
          url = '/login';
          break;
        }
        url = '/login?returnTo=' + encodeURI(returnTo);
        break;
      case 'admin':
        url = '/admin/login?returnTo=' + encodeURI(returnTo);
        break;
    }
    this.router.navigateByUrl(url);
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    switch (route.routeConfig?.path) {
      case '':
        return this.authService.isLoggedIn('user') ? true : this.redirectToLogin('user', state.url);
      case 'admin':
        return this.authService.isLoggedIn('admin') ? true : this.redirectToLogin('admin', state.url);
      default:
        return true;
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
