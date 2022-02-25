import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {User} from '../models/user';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {handleError, handleForbiddenAdmin, handleForbiddenUser, ServiceUtil, toApiResponse} from './service.util';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = environment.apiRoot;

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<User[]>(`${this.api}/users`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('user')
    }).pipe(
      toApiResponse<User[]>(),
      catchError(handleError<User[]>()),
      handleForbiddenUser(this.auth),
    );
  }

  getUsersAdmin(): Observable<ApiResponse<User[]>> {
    return this.http.get<User[]>(`${this.api}/users`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<User[]>(),
        catchError(handleError<User[]>()),
        handleForbiddenAdmin(this.auth),
      );
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<User>(`${this.api}/users/${id}`, {observe: 'response', headers: this.util.getTokenHeaders('user')})
      .pipe(
        toApiResponse<User>(),
        catchError(handleError<User>()),
        handleForbiddenUser(this.auth),
      );
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<User>(`${this.api}/users/${id}`, {observe: 'response', headers: this.util.getTokenHeaders('user')})
      .pipe(
        toApiResponse<User>(),
        catchError(handleError<User>()),
        handleForbiddenUser(this.auth),
      );
  }

  addUser(name: string): Observable<ApiResponse> {
    return this.http.post(`${this.api}/users/${name}`, '', {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  deleteUser(user: User): Observable<ApiResponse> {
    return this.http.delete(`${this.api}/users/${user.name}`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  updateBalance(user: User, moneyToAdd: number, reason: string): Observable<ApiResponse> {
    return this.http.patch(`${this.api}/users/${user.name}`, {amount: moneyToAdd, reason}, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  toggleVisibility(user: User): Observable<ApiResponse> {
    return this.http.post(`${this.api}/users/${user.name}/${user.hidden ? 'show' : 'hide'}`, '', {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  // Statistics for admin dashboard

  getTopDebtors(): Observable<ApiResponse<User[]>> {
    return this.http.get<User[]>(`${this.api}/stats/top/debtors`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<User[]>(),
        catchError(handleError<User[]>()),
        handleForbiddenAdmin(this.auth),
      );
  }

  getTopSavers(): Observable<ApiResponse<User[]>> {
    return this.http.get<User[]>(`${this.api}/stats/top/savers`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<User[]>(),
        catchError(handleError<User[]>()),
        handleForbiddenAdmin(this.auth),
      );
  }

  getUserCount(): Observable<ApiResponse<number>> {
    return this.http.get<number>(`${this.api}/stats/users`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<number>(),
        catchError(handleError<number>()),
        handleForbiddenAdmin(this.auth),
      );
  }
}
