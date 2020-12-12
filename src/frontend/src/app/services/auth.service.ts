import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export enum LoginError {
  NETWORK_ERROR,
  WRONG_PASSWORD,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) {
  }

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

  loginUser(password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // TODO: do some REST magic to get a token
    });
  }

  logoutUser(): void {
    this.userToken = null;
  }

  logoutAdmin(): void {
    this.adminToken = null;
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
