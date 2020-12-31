import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {handleError, toApiResponse} from './service.util';

export enum LoginError {
  NETWORK_ERROR,
  WRONG_PASSWORD,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly api = AppConfig.config.api;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
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

  logoutAdmin(): void {
    this.http.post(`${this.api}/logout?token=${this.adminToken}`, '', {responseType: 'text'}).subscribe(() => {
      if (this.userToken === this.adminToken) {
        this.userToken = null;
      }
      this.adminToken = null;
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

  logoutUser(): void {
    this.http.post(`${this.api}/logout?token=${this.userToken}`, '', {responseType: 'text'}).subscribe(() => {
      if (this.adminToken === this.userToken) {
        this.adminToken = null;
      }
      this.userToken = null;
      this.router.navigateByUrl('/login');
    });
  }

  // General Auth

  login(password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post<{ token: string, root: boolean }>(`${this.api}/login`, {password}, {observe: 'response'})
        .pipe(
          toApiResponse<{ token: string, root: boolean }>(),
          catchError(handleError<{ token: string, root: boolean }>()),
        )
        .subscribe(response => {
          if (response.status === 200 && response.data) {
            this.userToken = response.data.token;
            if (response.data.root) {
              this.adminToken = response.data.token;
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
}
