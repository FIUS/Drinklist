import {Component, Input} from '@angular/core';
import {faUndoAlt} from '@fortawesome/free-solid-svg-icons';
import {OrderService} from '../../services/order.service';
import {Util} from '../../util';
import {BeverageTransaction} from '../../models/beverage-transaction';
import {TransactionsService} from '../../services/transactions.service';

@Component({
  selector: 'app-admin-beverage-transaction-actions',
  template: `
    <button class="btn btn-sm btn-warning" (click)="deleteConfirm.open()">
      <fa-icon [icon]="icons.undo"></fa-icon>
      Rollback
    </button>
    <app-admin-confirmation-modal #deleteConfirm [callback]="deleteOrder">
      Do you really want to rollback transaction <strong>{{transaction.id}}</strong>?<br>
      Doing so will:
      <ul>
        <li *ngIf="transaction.beverage"><span class="font-weight-bold" [class.text-success]="transaction.units > 0"
                                               [class.text-danger]="transaction.units < 0">
          {{transaction.units > 0 ? 'In' : 'De'}}crease
        </span> the stock of <strong>{{transaction.beverage}}</strong> by {{abs(transaction.units)}}
        </li>
        <li>
          <span class="font-weight-bold" [class.text-success]="transaction.money < 0" [class.text-danger]="transaction.money > 0">
          {{transaction.money < 0 ? 'In' : 'De'}}crease
        </span> the balance of <strong>{{transaction.user}}</strong> by {{moneyFormat(abs(transaction.money))}}
        </li>
      </ul>
    </app-admin-confirmation-modal>
  `,
  styles: []
})
export class AdminBeverageTransactionActionsComponent {
  @Input() transaction!: BeverageTransaction;

  @Input() refresh!: () => void;

  // Aliases for template access
  abs = Math.abs;
  moneyFormat = Util.moneyFormat;

  // FontAwesome icons
  icons = {
    undo: faUndoAlt,
  };

  constructor(
    private orderService: OrderService,
    private txnService: TransactionsService
  ) {
  }

  deleteOrder = () => {
    this.txnService.deleteBeverageTxn(this.transaction).subscribe(response => {
      if (response.status === 200) {
        this.refresh();
      }
    });
  };

}
