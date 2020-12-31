import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {AuthService} from './auth.service';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {handleError, handleForbiddenUser, ServiceUtil, toApiResponse} from './service.util';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = AppConfig.config.api;

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  /**
   * @return Observable with ApiResponse of either User[] (if token is an admin token) or string[] (if token is an admin token)
   */
  getUsers(): Observable<ApiResponse<User[] | string[]>> {
    const token = this.auth.getUserToken() || '';
    const headers = new HttpHeaders({'X-Auth-Token': token});
    return this.http.get<User[] | string[]>(`${this.api}/users`, {observe: 'response', headers}).pipe(
      toApiResponse<User[] | string[]>(),
      catchError(handleError<User[] | string[]>()),
      handleForbiddenUser(this.auth),
    );
  }

  getUser(username: string): Observable<ApiResponse<User>> {
    return this.http.get<User>(`${this.api}/users/${username}`, {observe: 'response', headers: this.util.getTokenHeaders('user')})
      .pipe(
        toApiResponse<User>(),
        catchError(handleError<User>()),
        handleForbiddenUser(this.auth),
      );
  }
}
