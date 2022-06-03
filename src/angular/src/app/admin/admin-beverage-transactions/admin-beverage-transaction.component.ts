import {Component, OnInit} from '@angular/core';
import {faHistory} from '@fortawesome/free-solid-svg-icons';
import {BeverageTransaction} from '../../models/beverage-transaction';
import {TransactionsService} from '../../services/transactions.service';

@Component({
  selector: 'app-admin-beverage-transaction',
  template: `
    <div class="container-fluid">
      <h1>
        <fa-icon [icon]="icons.history"></fa-icon>
        Beverage Transactions
      </h1>
      <app-admin-beverage-transaction-table [transacations]="transactions" [refresh]="refresh"></app-admin-beverage-transaction-table>
    </div>
  `,
  styles: []
})
export class AdminBeverageTransactionComponent implements OnInit {

  transactions: BeverageTransaction[] = [];

  // FontAwesome icons
  icons = {
    history: faHistory,
  };

  constructor(
    private txnService: TransactionsService,
  ) {
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  refresh = () => {
    this.loadOrders();
  };

  loadOrders(): void {
    this.txnService.getBeverageTxns().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.transactions = response.data;
      }
    });
  }

}
