import {Component, Input} from '@angular/core';
import {faUndoAlt} from '@fortawesome/free-solid-svg-icons';
import {Util} from '../../util';
import {ICashTransaction} from '../../models/i-cash-transaction';
import {TransactionsService} from '../../services/transactions.service';

@Component({
  selector: 'app-admin-cash-transaction-actions',
  template: `
    <button class="btn btn-sm btn-warning" (click)="deleteConfirm.open()">
      <fa-icon [icon]="icons.undo"></fa-icon>
      Rollback
    </button>
    <app-admin-confirmation-modal #deleteConfirm [callback]="deleteTransaction">
      Do you really want to rollback transaction #<strong>{{transaction.id}}</strong>?<br>
      Doing so will:
      <ul>
        <li *ngIf="transaction.beverageTxn">Also revert beverage transaction #<strong>{{transaction.beverageTxn}}</strong>.</li>
        <!-- TODO: bring this to current featureset
        <li>
          <span class="font-weight-bold" [class.text-success]="order.amount < 0" [class.text-danger]="order.amount > 0">
          {{order.amount < 0 ? 'In' : 'De'}}crease
        </span> the balance of <strong>{{order.user}}</strong> by {{moneyFormat(abs(order.amount))}}
        </li> -->
        <li>TBD</li>
      </ul>
    </app-admin-confirmation-modal>
  `,
  styles: []
})
export class AdminCashTransactionActionsComponent {
  @Input() transaction!: ICashTransaction;

  @Input() refresh!: () => void;

  // Aliases for template access
  abs = Math.abs;
  moneyFormat = Util.moneyFormat;

  // FontAwesome icons
  icons = {
    undo: faUndoAlt,
  };

  constructor(
    private txnService: TransactionsService,
  ) {
  }

  deleteTransaction = () => {
    this.txnService.deleteCashTxn(this.transaction).subscribe({
      next: () => {
        this.refresh();
      }
    });
  };

}
