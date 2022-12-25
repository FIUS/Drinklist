import {Component, Input} from '@angular/core';
import {Util} from '../../util';
import {ICashTransaction} from '../../models/i-cash-transaction';
import {CashTransaction} from '../../models/cash-transaction';

@Component({
  selector: 'app-admin-cash-transaction-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">User From</th>
          <th scope="col">User To</th>
          <th scope="col">Reason</th>
          <th scope="col">Amount</th>
          <th scope="col">Timestamp</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th><input class="form-control text-end" placeholder="Search..." [(ngModel)]="search.id"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.userFrom"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.userTo"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.reason"></th>
          <th><input class="form-control text-end" placeholder="Search..." [(ngModel)]="search.amount"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.timestamp"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let txn of transactions.filter(matchesSearch, this)" app-admin-cash-transaction-table-entry [transaction]="txn"
            [refresh]="refresh" [class.table-warning]="txn.amount > 0"></tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class AdminCashTransactionTableComponent {
  @Input() transactions: CashTransaction[] = [];

  @Input() refresh!: () => void;

  search = {
    id: '',
    userFrom: '',
    userTo: '',
    reason: '',
    amount: '',
    timestamp: '',
  };

  constructor() {
  }

  matchesSearch(txn: ICashTransaction): boolean {
    const matchesID = txn.id.toString().includes(this.search.id.toLowerCase());
    const matchesUserFrom = txn.userFrom.toString().includes(this.search.userFrom.toLowerCase());
    const matchesUserTo = txn.userTo.toString().includes(this.search.userTo.toLowerCase());
    const matchesReason = txn.reason.toLowerCase().includes(this.search.reason.toLowerCase());
    const matchesAmount = Util.moneyFormat(txn.amount).toLowerCase().includes(this.search.amount.toLowerCase());
    const matchesTimestamp = txn.timestamp.toISOString().includes(this.search.timestamp.toLowerCase());

    return matchesID && matchesUserFrom && matchesUserTo && matchesReason && matchesAmount && matchesTimestamp;
  }

}
