import {Component, Input} from '@angular/core';
import {Order} from '../../models/order';
import {faUndoAlt} from '@fortawesome/free-solid-svg-icons';
import {OrderService} from '../../services/order.service';
import {Util} from '../../util';

@Component({
  selector: 'app-admin-history-actions',
  template: `
    <button class="btn btn-sm btn-warning" (click)="deleteConfirm.open()">
      <fa-icon [icon]="icons.undo"></fa-icon>
      Rollback
    </button>
    <app-admin-confirmation-modal #deleteConfirm [callback]="deleteOrder">
      Do you really want to rollback transaction <strong>{{order.id}}</strong>?<br>
      Doing so will:
      <ul>
        <li *ngIf="order.beverage"><span class="font-weight-bold" [class.text-success]="order.beverage_count > 0"
                                         [class.text-danger]="order.beverage_count < 0">
          {{order.beverage_count > 0 ? 'In' : 'De'}}crease
        </span> the stock of <strong>{{order.beverage}}</strong> by {{abs(order.beverage_count)}}
        </li>
        <li>
          <span class="font-weight-bold" [class.text-success]="order.amount < 0" [class.text-danger]="order.amount > 0">
          {{order.amount < 0 ? 'In' : 'De'}}crease
        </span> the balance of <strong>{{order.user}}</strong> by {{moneyFormat(abs(order.amount))}}
        </li>
      </ul>
    </app-admin-confirmation-modal>
  `,
  styles: []
})
export class AdminHistoryActionsComponent {
  @Input() order!: Order;

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
  ) {
  }

  deleteOrder = () => {
    this.orderService.deleteOrder(this.order).subscribe(response => {
      if (response.status === 200) {
        this.refresh();
      }
    });
  };

}
