import {ICashTransaction} from './i-cash-transaction';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from './user';
import {UserService} from '../services/user.service';

export class CashTransaction implements ICashTransaction {

  private readonly userFromSubject = new ReplaySubject<User>(1);
  readonly userFrom$: Observable<User> = this.userFromSubject.asObservable();

  private readonly userToSubject = new ReplaySubject<User>(1);
  readonly userTo$: Observable<User> = this.userToSubject.asObservable();

  constructor(
    public amount: number,
    public id: number,
    public reason: string,
    public reverted: boolean,
    public timestamp: Date,
    public userFrom: number,
    public userTo: number,
    userService: UserService,
    public beverageTxn?: number,
  ) {
    userService.getUserById(userFrom).subscribe(res => {
      if (res.ok && res.data) {
        this.userFromSubject.next(res.data);
      } else {
        this.userFromSubject.next({id: -1, name: '[Unkown User]', balance: 0, hidden: 0, deleted: 0});
      }
    });
    userService.getUserById(userTo).subscribe(res => {
      if (res.ok && res.data) {
        this.userToSubject.next(res.data);
      } else {
        this.userToSubject.next({id: -1, name: '[Unkown User]', balance: 0, hidden: 0, deleted: 0});
      }
    });
  }

  static fromInterface(txn: ICashTransaction, userService: UserService): CashTransaction {
    return new CashTransaction(txn.amount, txn.id, txn.reason, txn.reverted, txn.timestamp, txn.userFrom, txn.userTo,
      userService, txn.beverageTxn);
  }

  isFresh(): boolean {
    const deadline = new Date (new Date(this.timestamp).getTime() + 30000);
    return deadline > new Date();
  }
}
