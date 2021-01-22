import {Component, Input} from '@angular/core';
import {Order} from '../../models/order';
import {Util} from '../../util';

@Component({
  selector: 'app-admin-history-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col" class="text-right" style="width: 5%">#</th>
          <th scope="col" style="width: 7.5%">ID</th>
          <th scope="col">User</th>
          <th scope="col">Reason</th>
          <th scope="col" style="width: 10%">Amount</th>
          <th scope="col" style="width: 12.5%">Timestamp</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th class="text-right">{{orders.filter(matchesSearch, this).length}}</th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.id"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.user"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.reason"></th>
          <th><input class="form-control text-right" placeholder="Search..." [(ngModel)]="search.amount"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.timestamp"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let order of orders.filter(matchesSearch, this); index as i" app-admin-history-table-entry [order]="order"
            [number]="i + 1" [refresh]="refresh" [class.table-warning]="order.amount > 0"></tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class AdminHistoryTableComponent {
  @Input() orders: Order[] = [];

  @Input() refresh!: () => void;

  search = {
    id: '',
    user: '',
    reason: '',
    amount: '',
    timestamp: '',
  };

  constructor() {
  }

  matchesSearch(order: Order): boolean {
    const matchesID = order.id.toLowerCase().includes(this.search.id.toLowerCase());
    const matchesUser = order.user.toLowerCase().includes(this.search.user.toLowerCase());
    const matchesReason = order.reason.toLowerCase().includes(this.search.reason.toLowerCase());
    const matchesAmount = Util.moneyFormat(order.amount).toLowerCase().includes(this.search.amount.toLowerCase());
    const matchesTimestamp = order.timestamp.toLowerCase().includes(this.search.timestamp.toLowerCase());

    return matchesID && matchesUser && matchesReason && matchesAmount && matchesTimestamp;
  }

}
