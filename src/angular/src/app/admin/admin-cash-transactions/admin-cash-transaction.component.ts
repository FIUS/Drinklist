import {Component, OnInit} from '@angular/core';
import {faHistory, faMoneyBill} from '@fortawesome/free-solid-svg-icons';
import {TransactionsService} from '../../services/transactions.service';
import {CashTransaction} from '../../models/cash-transaction';

@Component({
  selector: 'app-admin-cash-transaction',
  template: `
    <div class="container-fluid">
      <h1>
        <fa-icon [icon]="icons.moneyBill"></fa-icon>
        Cash Transactions
      </h1>
      <app-admin-cash-transaction-table [transactions]="transactions" [refresh]="refresh"></app-admin-cash-transaction-table>
    </div>
  `,
  styles: []
})
export class AdminCashTransactionComponent implements OnInit {

  transactions: CashTransaction[] = [];

  // FontAwesome icons
  icons = {
    history: faHistory,
    moneyBill: faMoneyBill
  };

  constructor(
    private txnService: TransactionsService,
  ) {
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  refresh = () => {
    this.loadTransactions();
  };

  loadTransactions(): void {
    this.txnService.getCashTxns().subscribe({
      next: tnxs => {
        this.transactions = tnxs;
      }
    });
  }

}
