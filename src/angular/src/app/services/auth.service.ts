import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {handleError, handleForbiddenAdmin, ServiceUtil, toApiResponse} from './service.util';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {Session} from '../models/session';
import {environment} from '../../environments/environment';
import jwtDecode from 'jwt-decode';
import {JwtClaims} from '../models/jwt-claims';

export enum LoginError {
  NETWORK_ERROR,
  WRONG_PASSWORD,
  UNKNOWN_ERROR,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly api = environment.apiRoot;

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.util = new ServiceUtil(this);
  }

  private get token(): string | null {
    return localStorage.getItem('token');
  }

  private get claims(): JwtClaims | null {
    return JSON.parse(localStorage.getItem('claims') as string);
  }

  private set token(value: string | null) {
    if (value === null) {
      localStorage.removeItem('token');
      localStorage.removeItem('claims');
      return;
    }
    const claims = jwtDecode<JwtClaims>(value);
    localStorage.setItem('token', value);
    localStorage.setItem('claims', JSON.stringify(claims));
  }

  getToken(): string | null {
    return this.token;
  }

  getTokenId(): string | null {
    return this.claims?.jti || null;
  }

  logout(noNavigation?: boolean): void {
    if (!this.token) {
      return;
    }
    this.http.post(`${this.api}/auth/logout`, {token: this.token}).subscribe(() => {
      // This ignores errors when trying to log out

      this.token = null;
      if (noNavigation) {
        return;
      }
      this.router.navigateByUrl('/login');
    });
  }

  login(password: string, requireAdmin?: boolean): Promise<void> { // TODO: Refactor to return an Observable
    // Invalidate old token (if any) since we're trying to log in.
    this.logout(true);
    return new Promise<void>((resolve, reject) => {
      this.http.post(`${this.api}/auth/login`, {password}, {responseType: 'text'})
        .subscribe({
          next: token => {
            // Login successful
            this.token = token;

            if (requireAdmin && !this.isLoggedInAsRole('admin')) {
              // Fail here since we require the token to be admin capable.
              this.logout(true); // Dispose "invalid" token
              return reject(LoginError.WRONG_PASSWORD);
            }
            return resolve();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 400 || error.status === 401) {
              return reject(LoginError.WRONG_PASSWORD);
            }
            if (error.status === 0) {
              return reject(LoginError.NETWORK_ERROR);
            }
            console.error(`Unexpected error occurred while logging in: ${error.message}`, error);
            return reject(LoginError.UNKNOWN_ERROR);
          }
        });
    });
  }

  isLoggedInAsRole(role: 'user' | 'admin' | 'any'): boolean {
    const roles = this.claims?.roles;

    if (!roles) {
      return false;
    }

    if (role === 'any') {
      return true;
    }

    return roles.includes(role);
  }

  getTokens(): Observable<ApiResponse<Session[]>> {
    return this.http.get<Session[]>(`${this.api}/auth/tokens`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<Session[]>(),
        catchError(handleError<Session[]>()),
        handleForbiddenAdmin(this),
      );
  }

  revokeToken(token: Session): Observable<ApiResponse> {
    return this.http.post(`${this.api}/auth/revoke`, {token: token.token}, {observe: 'response', headers: this.util.getTokenHeaders()})
      .pipe(
        toApiResponse<any>(),
        catchError(handleError()),
      );
  }
}
