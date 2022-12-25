import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {BeverageService} from '../services/beverage.service';
import {Beverage} from '../models/beverage';
import {LocaleService} from '../services/locale.service';
import {Util} from '../util';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {AppConfig} from '../app.config';
import {TransactionsService} from '../services/transactions.service';
import {BeverageTransaction} from '../models/beverage-transaction';

@Component({
  selector: 'app-user-detail-page',
  templateUrl: 'user-detail-page.component.html',
  styles: [`
    .btn-beverage {
      background-color: #efefef;
    }

    .btn-beverage:hover {
      background-color: #dfdfdf;
    }

    .vertical-align-middle td {
      vertical-align: middle;
    }
  `]
})
export class UserDetailPageComponent implements OnInit {

  user: User | null = null;
  beverages: Beverage[] = [];
  transactions: BeverageTransaction[] = [];

  get showStock(): boolean {
    return AppConfig.config.stock;
  }

  // Wrap util method in local field
  moneyFormat = Util.moneyFormat;

  // FontAwesome Icons
  faTrash = faTrash;

  constructor(
    private route: ActivatedRoute,
    public locale: LocaleService,
    private userService: UserService,
    private beverageService: BeverageService,
    private txnService: TransactionsService,
  ) {
  }

  private loadData(userId: number): void {
    if (userId < 0) {
      return;
    }

    this.userService.getUser(userId).subscribe({
      next: user => {
        this.user = user;
      }
    });

    this.beverageService.getBeverages().subscribe({
      next: beverages => {
        this.beverages = beverages;
      }
    });

    this.txnService.getBeverageTxnsByUser(userId).subscribe({
      next: txns => {
        this.transactions = txns;
      }
    });
  }

  ngOnInit(): void {
    const userId = +(this.route.snapshot.paramMap.get('id') || -1);

    this.loadData(userId);
  }

  getSafeUserBalance(): number {
    return this.user?.balance || 0;
  }

  order(beverage: Beverage): void {
    if (!this.user) {
      return;
    }

    this.txnService.orderBeverage(this.user, beverage).subscribe({
      next: () => {
        // Give the DB some time to process the order.
        setTimeout(() => {
          this.loadData(this.user?.id || -1);
        }, 100);
      }
    });
  }

  deleteFreshOrder(txn: BeverageTransaction): void {
    if (!txn.isFresh()) {
      return;
    }
    this.txnService.deleteBeverageTxn(txn).subscribe({
      next: () => {
        // Give the DB some time to process the deletion.
        setTimeout(() => {
          this.loadData(this.user?.id || -1);
        }, 100);
      }
    });
  }
}
