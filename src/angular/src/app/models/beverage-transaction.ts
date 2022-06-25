import {IBeverageTransaction} from './i-beverage-transaction';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from './user';
import {Beverage} from './beverage';
import {UserService} from '../services/user.service';
import {BeverageService} from '../services/beverage.service';
import {retry} from 'rxjs/operators';

export class BeverageTransaction implements IBeverageTransaction {

  private readonly userSubject = new ReplaySubject<User>(1);
  readonly user$: Observable<User> = this.userSubject.asObservable();

  private readonly beverageSubject = new ReplaySubject<Beverage>(1);
  readonly beverage$: Observable<Beverage> = this.beverageSubject.asObservable();

  constructor(
    public beverage: number,
    public id: number,
    public money: number,
    public timestamp: Date,
    public units: number,
    public user: number,
    userService: UserService,
    beverageService: BeverageService,
    public cashTxn?: number,
  ) {
    userService.getUserById(user).pipe(
      retry(3), // retry up to three times on error
    ).subscribe({
      next: user => {
        this.userSubject.next(user);
      },
      error: err => {
        console.error(err);
        this.userSubject.next({id: -1, name: '[Unkown User]', balance: 0, hidden: 0, deleted: 0});
      }
    });
    beverageService.getBeverageById(beverage).pipe(
      retry(3), // retry up to three times on error
    ).subscribe({
      next: beverage => {
        this.beverageSubject.next(beverage);
      },
      error: err => {
        console.error(err);
        this.beverageSubject.next({id: -1, name: '[Unknown Beverage]', stock: 0, price: 0});
      }
    });
  }

  static fromInterface(txn: IBeverageTransaction, userService: UserService, beverageService: BeverageService): BeverageTransaction {
    return new BeverageTransaction(txn.beverage, txn.id, txn.money, txn.timestamp, txn.units, txn.user,
      userService, beverageService, txn.cashTxn);
  }

  isFresh(): boolean {
    const deadline = new Date(new Date(this.timestamp).getTime() + 30000);
    return deadline > new Date();
  }
}
