import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Order} from '../models/order';
import {AppConfig} from '../app.config';
import {handleError, handleForbiddenUser, ServiceUtil, toApiResponse} from './service.util';
import {AuthService} from './auth.service';
import {ApiResponse} from '../models/api-response';
import {catchError, map} from 'rxjs/operators';
import {User} from '../models/user';
import {Beverage} from '../models/beverage';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly api = AppConfig.config.api;

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  getUserOrders(username: string): Observable<ApiResponse<Order[]>> {
    return this.http.get<Order[]>(
      `${this.api}/orders/${username}`,
      {observe: 'response', headers: this.util.getTokenHeaders('user')}
    ).pipe(
      toApiResponse<Order[]>(),
      catchError(handleError<Order[]>()),
      handleForbiddenUser(this.auth),
      map((value: ApiResponse<Order[]>) => {
        if (value.data) {
          for (const order of value.data) {
            // Inject method into objects
            order.isFresh = Order.prototype.isFresh;
          }
        }
        return value;
      })
    );
  }

  createOrder(user: User, beverage: Beverage): Observable<ApiResponse> {
    return this.http.post(`${this.api}/orders?user=${user.name}&beverage=${beverage.name}`, '', {
      observe: 'response',
      headers: this.util.getTokenHeaders('user'),
      responseType: 'text',
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenUser(this.auth),
    );
  }

  deleteOrder(order: Order): Observable<ApiResponse> {
    return this.http.delete(`${this.api}/orders/${order.id}`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('user'),
      responseType: 'text'
    })
      .pipe(
        toApiResponse(),
        catchError(handleError()),
        handleForbiddenUser(this.auth),
      );
  }
}
