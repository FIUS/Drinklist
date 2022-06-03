import {Component, Input} from '@angular/core';
import {Util} from '../../util';
import {CashTransaction} from '../../models/cash-transaction';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-admin-cash-transaction-table-entry]',
  template: `
    <td class="text-right pr-3">{{transaction.id}}</td>
    <td>{{(transaction.userFrom$ | async)?.name}}</td>
    <td>{{(transaction.userTo$ | async)?.name}}</td>
    <td>{{transaction.reason}}</td>
    <td class="text-right pr-3" [class.text-danger]="transaction.amount < 0"
        [class.text-success]="transaction.amount > 0">{{moneyFormat(transaction.amount)}}</td>
    <td>{{transaction.timestamp | date:'d.MM.yyyy HH:mm'}}</td>
    <td>
      <app-admin-cash-transaction-actions [transaction]="transaction" [refresh]="refresh"></app-admin-cash-transaction-actions>
    </td>
  `,
  styles: []
})
export class AdminCashTransactionTableEntryComponent {
  @Input() transaction!: CashTransaction;

  @Input() refresh!: () => void;

  // Aliases for template access
  moneyFormat = Util.moneyFormat;

  constructor() {
  }

}
