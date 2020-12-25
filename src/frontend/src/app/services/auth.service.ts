import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../app.config';

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
  ) {
    if (this.api.endsWith('/')) {
      this.api = this.api.substring(0, this.api.length - 1);
    }
    console.log(this.api);
  }

  // Admin Auth

  private get adminToken(): string | null {
    return localStorage.getItem('userToken');
  }

  private set adminToken(value: string | null) {
    if (value === null) {
      localStorage.removeItem('adminToken');
      return;
    }
    localStorage.setItem('adminToken', value);
  }

  logoutAdmin(): void {
    this.adminToken = null;
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

  logoutUser(): void {
    this.userToken = null;
  }

  // General Auth

  login(password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post<{ token: string, root: boolean }>(`${this.api}/login`, {password}, {observe: 'response'}).subscribe(response => {
        if (response.status === 200 && response.body) {
          this.userToken = response.body.token;
          if (response.body.root) {
            this.adminToken = response.body.token;
          }
          return resolve();
        }
        if (response.status === 400 || response.status === 403) {
          return reject(LoginError.WRONG_PASSWORD);
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
