import {Component, Input} from '@angular/core';
import {Order} from '../../models/order';
import {Util} from '../../util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-admin-history-table-entry]',
  template: `
    <th scope="row" class="text-right">{{number}}</th>
    <td>{{order.id.split('-')[0]}}</td>
    <td>{{order.user}}</td>
    <td>{{order.reason}}</td>
    <td class="text-right pr-3" [class.text-danger]="order.amount < 0"
        [class.text-success]="order.amount > 0">{{moneyFormat(order.amount)}}</td>
    <td>{{order.timestamp}}</td>
    <td>
      <app-admin-history-actions [order]="order" [refresh]="refresh"></app-admin-history-actions>
    </td>
  `,
  styles: []
})
export class AdminHistoryTableEntryComponent {
  @Input() order!: Order;
  @Input() number = -1;

  @Input() refresh!: () => void;

  // Aliases for template access
  moneyFormat = Util.moneyFormat;

  constructor() {
  }

}
