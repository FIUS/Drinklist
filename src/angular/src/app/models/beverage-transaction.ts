import {IBeverageTransaction} from './i-beverage-transaction';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from './user';
import {Beverage} from './beverage';
import {UserService} from '../services/user.service';
import {BeverageService} from '../services/beverage.service';

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
    userService.getUserById(user).subscribe(res => {
      if (res.ok && res.data) {
        this.userSubject.next(res.data);
      } else {
        this.userSubject.next({id: -1, name: '[Unkown User]', balance: 0, hidden: 0, deleted: 0});
      }
    });
    beverageService.getBeverageById(beverage).subscribe(res => {
      if (res.ok && res.data) {
        this.beverageSubject.next(res.data);
      } else {
        this.beverageSubject.next({id: -1, name: '[Unknown Beverage]', stock: 0, price: 0});
      }
    });
  }

  static fromInterface(txn: IBeverageTransaction, userService: UserService, beverageService: BeverageService): BeverageTransaction {
    return new BeverageTransaction(txn.beverage, txn.id, txn.money, txn.timestamp, txn.units, txn.user,
      userService, beverageService, txn.cashTxn);
  }

  isFresh(): boolean {
    const deadline = new Date (new Date(this.timestamp).getTime() + 30000);
    return deadline > new Date();
  }
}
