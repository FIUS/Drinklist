import {Component, Input} from '@angular/core';
import {Util} from '../../util';
import {BeverageTransaction} from '../../models/beverage-transaction';

@Component({
  selector: 'app-admin-beverage-transaction-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">User</th>
          <th scope="col">Beverage</th>
          <th scope="col">Money</th>
          <th scope="col">Units</th>
          <th scope="col">Cash TXN#</th>
          <th scope="col">Timestamp</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th><input class="form-control text-right" placeholder="Search..." [(ngModel)]="search.id"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.user"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.beverage"></th>
          <th><input class="form-control text-right" placeholder="Search..." [(ngModel)]="search.money"></th>
          <th><input class="form-control text-right" placeholder="Search..." [(ngModel)]="search.cashTxn"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.timestamp"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let transaction of transacations.filter(matchesSearch, this); index as i" app-admin-beverage-transaction-table-entry
            [transaction]="transaction" [refresh]="refresh" [class.table-warning]="transaction.units < 0"></tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class AdminBeverageTransactionTableComponent {
  @Input() transacations: BeverageTransaction[] = [];

  @Input() refresh!: () => void;

  search = {
    id: '',
    user: '',
    beverage: '',
    money: '',
    cashTxn: '',
    timestamp: '',
  };

  constructor() {
  }

  matchesSearch(txn: BeverageTransaction): boolean {
    const matchesID = txn.id.toString().includes(this.search.id.toLowerCase());
    const matchesUser = txn.user.toString().includes(this.search.user.toLowerCase());
    const matchesBeverage = txn.beverage.toString().includes(this.search.beverage.toLowerCase());
    const matchesMoney = Util.moneyFormat(txn.money).toLowerCase().includes(this.search.money.toLowerCase());
    const matchesCashTxn = txn.timestamp.toISOString().includes(this.search.cashTxn.toLowerCase());
    const matchesTimestamp = txn.timestamp.toISOString().includes(this.search.timestamp.toLowerCase());

    return matchesID && matchesUser && matchesBeverage && matchesMoney && matchesCashTxn && matchesTimestamp;
  }

}
