import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {handleError, handleForbiddenAdmin, handleForbiddenUser, ServiceUtil, toApiResponse} from './service.util';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {ICashTransaction} from '../models/i-cash-transaction';
import {catchError, map} from 'rxjs/operators';
import {IBeverageTransaction} from '../models/i-beverage-transaction';
import {BeverageTransaction} from '../models/beverage-transaction';
import {UserService} from './user.service';
import {BeverageService} from './beverage.service';
import {CashTransaction} from '../models/cash-transaction';
import {User} from '../models/user';
import {Beverage} from '../models/beverage';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly api = environment.apiRoot;

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private userService: UserService,
    private beverageService: BeverageService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  getCashTxns(): Observable<ApiResponse<CashTransaction[]>> {
    return this.http.get<ICashTransaction[]>(`${this.api}/transactions/cash`, {
      headers: this.util.getTokenHeaders('admin'),
      observe: 'response'
    }).pipe(
      toApiResponse<ICashTransaction[]>(),
      catchError(handleError<ICashTransaction[]>()),
      handleForbiddenAdmin(this.auth),
      map((res: ApiResponse<ICashTransaction[]>) => {
        if (res.data) {
          for (const txn of res.data) {
            txn.timestamp = new Date(txn.timestamp);
          }
        }
        return res;
      }),
      map(res => {
        if (res.ok && res.data) {
          return new ApiResponse<CashTransaction[]>(res.ok, res.status,
            res.data.map(txn => CashTransaction.fromInterface(txn, this.userService)));
        } else {
          return res as ApiResponse<CashTransaction[]>;
        }
      })
    );
  }

  deleteCashTxn(txn: ICashTransaction): Observable<ApiResponse> {
    return this.http.delete(`${this.api}/transactions/cash/${txn.id}`, {
      headers: this.util.getTokenHeaders('user'),
      observe: 'response'
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenUser(this.auth)
    );
  }

  getBeverageTxns(limit?: number): Observable<ApiResponse<BeverageTransaction[]>> {
    return this.http.get<IBeverageTransaction[]>(`${this.api}/transactions/beverages${limit ? `?limit=${limit}` : ''}`, {
      headers: this.util.getTokenHeaders('user'),
      observe: 'response'
    }).pipe(
      toApiResponse<IBeverageTransaction[]>(),
      catchError(handleError<IBeverageTransaction[]>()),
      handleForbiddenUser(this.auth),
      map((res: ApiResponse<IBeverageTransaction[]>) => {
        if (res.data) {
          for (const txn of res.data) {
            txn.timestamp = new Date(txn.timestamp);
          }
        }
        return res;
      }),
      map(res => {
        if (res.ok && res.data) {
          return new ApiResponse<BeverageTransaction[]>(res.ok, res.status,
            res.data.map(txn => BeverageTransaction.fromInterface(txn, this.userService, this.beverageService)));
        } else {
          return res as ApiResponse<BeverageTransaction[]>;
        }
      })
    );
  }

  getBeverageTxnsByUser(userId: number): Observable<ApiResponse<BeverageTransaction[]>> {
    return this.http.get<IBeverageTransaction[]>(`${this.api}/transactions/beverages/${userId}`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('user')
    }).pipe(
      toApiResponse<IBeverageTransaction[]>(),
      catchError(handleError<IBeverageTransaction[]>()),
      handleForbiddenUser(this.auth),
      map((res: ApiResponse<IBeverageTransaction[]>) => {
        if (res.data) {
          for (const txn of res.data) {
            txn.timestamp = new Date(txn.timestamp);
          }
        }
        return res;
      }),
      map(res => {
        if (res.ok && res.data) {
          return new ApiResponse<BeverageTransaction[]>(res.ok, res.status,
            res.data.map(txn => BeverageTransaction.fromInterface(txn, this.userService, this.beverageService)));
        } else {
          return res as ApiResponse<BeverageTransaction[]>;
        }
      })
    );
  }

  orderBeverage(user: User, beverage: Beverage): Observable<ApiResponse> {
    return this.http.post(`${this.api}/transactions/beverages/order`, {
      user: user.id,
      beverage: beverage.id
    }, {observe: 'response', headers: this.util.getTokenHeaders('user')}).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenUser(this.auth),
    );
  }

  deleteBeverageTxn(txn: IBeverageTransaction): Observable<ApiResponse> {
    return this.http.delete(`${this.api}/transactions/beverages/${txn.id}`, {
      headers: this.util.getTokenHeaders('user'),
      observe: 'response'
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenUser(this.auth)
    );
  }
}
