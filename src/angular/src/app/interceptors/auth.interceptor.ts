import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(environment.apiRoot) && request.url !== `${environment.apiRoot}/auth/login`) {
      // Only handle requests to API, but not login requests
      const token = this.auth.getToken();
      let clonedRequest = request;
      if (token) {
        clonedRequest = request.clone({
          headers: request.headers.set('X-Auth-Token', token)
        });
      }
      return next.handle(clonedRequest).pipe(
        tap({
          error: (err: HttpErrorResponse) => {
            switch (err.status) {
              case 401: // Unauthorized
                // Token is invalid
                console.log('Token invalid, prompting for login');
                this.auth.logout();
                break;
              case 403: // Forbidden
                console.warn('Tried to access resource that was not allowed!', err);
                break;
              default:
                return;
            }
          }
        })
      );
    }

    // Don't tamper with request if it is not an API request
    return next.handle(request);
  }
}
