import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {handleError, handleForbiddenAdmin, ServiceUtil, toApiResponse} from './service.util';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {Token} from '../models/token';

export enum LoginError {
  NETWORK_ERROR,
  WRONG_PASSWORD,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly api = AppConfig.config.api;

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.util = new ServiceUtil(this);
  }

  // Admin Auth

  private get adminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  private set adminToken(value: string | null) {
    if (value === null) {
      localStorage.removeItem('adminToken');
      return;
    }
    localStorage.setItem('adminToken', value);
  }

  getAdminToken(): string | null {
    return this.adminToken;
  }

  logoutAdmin(noNavigation?: boolean): void {
    if (!this.adminToken) {
      return;
    }
    this.http.post(`${this.api}/logout?token=${this.adminToken}`, '', {responseType: 'text'}).subscribe(() => {
      if (this.userToken === this.adminToken) {
        this.userToken = null;
      }
      this.adminToken = null;
      if (noNavigation) {
        return;
      }
      this.router.navigateByUrl('/admin/login');
    });
  }

  // User Auth
  private get userToken(): string | null {
    return localStorage.getItem('userToken');
  }

  private set userToken(value: string | null) {
    if (value === null) {
      localStorage.removeItem('userToken');
      return;
    }
    localStorage.setItem('userToken', value);
  }

  getUserToken(): string | null {
    return this.userToken;
  }

  logoutUser(noNavigation?: boolean): void {
    if (!this.userToken) {
      return;
    }
    this.http.post(`${this.api}/logout?token=${this.userToken}`, '', {responseType: 'text'}).subscribe(() => {
      if (this.adminToken === this.userToken) {
        this.adminToken = null;
      }
      this.userToken = null;
      if (noNavigation) {
        return;
      }
      this.router.navigateByUrl('/login');
    });
  }

  // General Auth

  login(password: string, failOnUser?: boolean): Promise<void> {
    // Invalidate old tokens (if any) since we're trying to log in.
    this.logoutAdmin(true);
    this.logoutUser(true);
    return new Promise<void>((resolve, reject) => {
      this.http.post<{ token: string, root: boolean }>(`${this.api}/login`, {password}, {observe: 'response'})
        .pipe(
          toApiResponse<{ token: string, root: boolean }>(),
          catchError(handleError<{ token: string, root: boolean }>()),
        )
        .subscribe(response => {
          if (response.status === 200 && response.data) { // Login with user permissions successful.
            this.userToken = response.data.token; /* This logs the user in, even if admin login is requested.
                                                     This behaviour is intended since the backend sends a token anyway. */
            if (response.data.root) { // Login with admin permissions successful.
              this.adminToken = response.data.token;
            } else if (failOnUser) {
              // Fail here since we require the token to be admin capable.
              return reject(LoginError.WRONG_PASSWORD);
            }
            return resolve();
          }
          if (response.status === 400 || response.status === 403) {
            return reject(LoginError.WRONG_PASSWORD);
          }
          if (response.status === 0) {
            return reject(LoginError.NETWORK_ERROR);
          }
        });
    });
  }

  isLoggedIn(component: 'user' | 'admin' | 'any'): boolean {
    switch (component) {
      case 'user':
        return this.userToken !== null;
      case 'admin':
        return this.adminToken !== null;
      case 'any':
        return this.userToken !== null || this.adminToken !== null;
    }
  }

  getTokens(): Observable<ApiResponse<Token[]>> {
    return this.http.get<Token[]>(`${this.api}/token`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<Token[]>(),
        catchError(handleError<Token[]>()),
        handleForbiddenAdmin(this),
      );
  }

  revokeToken(token: Token): Observable<ApiResponse> {
    return this.http.post(`${this.api}/logout?token=${token.token}`, '', {observe: 'response', responseType: 'text'})
      .pipe(
        toApiResponse<any>(),
        catchError(handleError()),
      );
  }
}
