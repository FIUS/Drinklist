import {Component, Input} from '@angular/core';
import {Util} from '../../util';
import {BeverageTransaction} from '../../models/beverage-transaction';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-admin-beverage-transaction-table-entry]',
  template: `
    <td class="text-right pr-3">{{transaction.id}}</td>
    <td>{{(transaction.user$ | async)?.name}}</td>
    <td>{{(transaction.beverage$ | async)?.name}}</td>
    <td class="text-right pr-3" [class.text-danger]="transaction.money < 0"
        [class.text-success]="transaction.money > 0">{{moneyFormat(transaction.money)}}</td>
    <td class="text-right pr-3">{{transaction.units}}</td>
    <td class="text-right pr-3">{{transaction.cashTxn}}</td>
    <td>{{transaction.timestamp | date:'d.MM.yyyy HH:mm'}}</td>
    <td>
      <app-admin-beverage-transaction-actions [transaction]="transaction" [refresh]="refresh"></app-admin-beverage-transaction-actions>
    </td>
  `,
  styles: []
})
export class AdminBeverageTransactionTableEntryComponent {
  @Input() transaction!: BeverageTransaction;

  @Input() refresh!: () => void;

  // Aliases for template access
  moneyFormat = Util.moneyFormat;

  constructor() {
  }

}
