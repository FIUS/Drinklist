import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {AuthService} from './auth.service';
import {handleError, handleForbiddenAdmin, handleForbiddenUser, ServiceUtil, toApiResponse} from './service.util';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {Beverage} from '../models/beverage';

@Injectable({
  providedIn: 'root'
})
export class BeverageService {

  private readonly api = AppConfig.config.api;
  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  getBeverages(): Observable<ApiResponse<Beverage[]>> {
    return this.http.get<Beverage[]>(`${this.api}/beverages`, {observe: 'response', headers: this.util.getTokenHeaders('user')})
      .pipe(
        toApiResponse<Beverage[]>(),
        catchError(handleError<Beverage[]>()),
        handleForbiddenUser(this.auth),
      );
  }

  getBeveragesAdmin(): Observable<ApiResponse<Beverage[]>> {
    return this.http.get<Beverage[]>(`${this.api}/beverages`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<Beverage[]>(),
        catchError(handleError<Beverage[]>()),
        handleForbiddenAdmin(this.auth),
      );
  }

  addBeverage(beverage: Beverage): Observable<ApiResponse> {
    return this.http.post<null>(`${this.api}/beverages?beverage=${beverage.name}&price=${beverage.price}&count=${beverage.stock}`, '', {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  addStock(beverage: Beverage, stockToAdd: number): Observable<ApiResponse> {
    return this.http.patch(`${this.api}/beverages/${beverage.name}?count=${stockToAdd}`, '', {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
      responseType: 'text',
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  updatePrice(beverage: Beverage, newPrice: number): Observable<ApiResponse> {
    return this.http.patch(`${this.api}/beverages/${beverage.name}?price=${newPrice}`, '', {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
      responseType: 'text',
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  deleteBeverage(beverage: Beverage): Observable<ApiResponse> {
    return this.http.delete(`${this.api}/beverages/${beverage.name}`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
      responseType: 'text',
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }

  // Admin dashboard statistics

  getTopBeverages(): Observable<ApiResponse<Beverage[]>> {
    return this.http.get<Beverage[]>(`${this.api}/stats/top/beverages`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin')
    }).pipe(
      toApiResponse<Beverage[]>(),
      catchError(handleError<Beverage[]>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  getBeverageCount(): Observable<ApiResponse<number>> {
    return this.http.get<number>(`${this.api}/stats/beverages`, {observe: 'response', headers: this.util.getTokenHeaders('admin')})
      .pipe(
        toApiResponse<number>(),
        catchError(handleError<number>()),
        handleForbiddenAdmin(this.auth),
      );
  }
}
