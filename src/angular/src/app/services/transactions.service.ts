import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {noop, Observable} from 'rxjs';
import {ICashTransaction} from '../models/i-cash-transaction';
import {map} from 'rxjs/operators';
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
  private readonly txnUrl = `${this.api}/transactions`;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private beverageService: BeverageService,
  ) {
  }

  getCashTxns(): Observable<CashTransaction[]> {
    return this.http.get<ICashTransaction[]>(`${this.txnUrl}/cash`).pipe(
      map((txns: ICashTransaction[]) => {
        for (const txn of txns) {
          txn.timestamp = new Date(txn.timestamp);
        }
        return txns.map(txn => CashTransaction.fromInterface(txn, this.userService));
      })
    );
  }

  newCashTransaction(userFrom: number, userTo: number, amount: number, reason: string): Observable<void> {
    return this.http.post(`${this.txnUrl}/cash`, {userFrom, userTo, amount, reason}).pipe(
      map(noop), // return void
    );
  }

  deleteCashTxn(txn: ICashTransaction): Observable<void> {
    return this.http.delete(`${this.txnUrl}/cash/${txn.id}`).pipe(
      map(noop), // return void
    );
  }

  getBeverageTxns(limit?: number): Observable<BeverageTransaction[]> {
    return this.http.get<IBeverageTransaction[]>(`${this.txnUrl}/beverages${limit ? `?limit=${limit}` : ''}`).pipe(
      map((txns: IBeverageTransaction[]) => {
        for (const txn of txns) {
          txn.timestamp = new Date(txn.timestamp);
        }
        return txns.map(txn => BeverageTransaction.fromInterface(txn, this.userService, this.beverageService));
      }),
    );
  }

  getBeverageTxnsByUser(userId: number): Observable<BeverageTransaction[]> {
    return this.http.get<IBeverageTransaction[]>(`${this.txnUrl}/beverages/${userId}`).pipe(
      map((tnxs: IBeverageTransaction[]) => {
        for (const txn of tnxs) {
          txn.timestamp = new Date(txn.timestamp);
        }
        return tnxs.map(txn => BeverageTransaction.fromInterface(txn, this.userService, this.beverageService));
      }),
    );
  }

  orderBeverage(user: User, beverage: Beverage): Observable<void> {
    return this.http.post(`${this.txnUrl}/beverages/order`, {
      user: user.id,
      beverage: beverage.id
    }).pipe(
      map(noop), // return void
    );
  }

  deleteBeverageTxn(txn: IBeverageTransaction): Observable<void> {
    return this.http.delete(`${this.txnUrl}/beverages/${txn.id}`).pipe(
      map(noop), // return void
    );
  }

  // Admin dashboard statistics

  getTransactionCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/stats/transactions`);
  }
}
