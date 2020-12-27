import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {AuthService} from './auth.service';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {handleError, toApiResponse} from './service.util';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = AppConfig.config.api;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
  }

  getUsers(): Observable<ApiResponse<User[]>> {
    const token = this.auth.getUserToken() || '';
    const headers = new HttpHeaders({'X-Auth-Token': token});
    return this.http.get<User[]>(`${this.api}/users`, {observe: 'response', headers}).pipe(
      toApiResponse<User[]>(),
      catchError(handleError<User[]>()),
      tap(value => {
        if (value.status === 403) { // Invalid Token
          this.auth.logoutUser();
        }
      })
    );
  }
}
