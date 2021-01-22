import {Component, OnInit} from '@angular/core';
import {faHistory} from '@fortawesome/free-solid-svg-icons';
import {OrderService} from '../../services/order.service';
import {Order} from '../../models/order';

@Component({
  selector: 'app-admin-history',
  template: `
    <div class="container-fluid">
      <h1>
        <fa-icon [icon]="icons.history"></fa-icon>
        History
      </h1>
      <app-admin-history-table [orders]="orders" [refresh]="refresh"></app-admin-history-table>
    </div>
  `,
  styles: []
})
export class AdminHistoryComponent implements OnInit {

  orders: Order[] = [];

  // FontAwesome icons
  icons = {
    history: faHistory,
  };

  constructor(
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  refresh = () => {
    this.loadOrders();
  };

  loadOrders(): void {
    this.orderService.getAdminHistory().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.orders = response.data;
      }
    });
  }

}
