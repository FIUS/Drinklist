import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {BeverageService} from '../services/beverage.service';
import {Beverage} from '../models/beverage';
import {LocaleService} from '../services/locale.service';
import {Util} from '../util';
import {OrderService} from '../services/order.service';
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
    private orderService: OrderService,
    private txnService: TransactionsService,
  ) {
  }

  private loadData(userId: number): void {
    if (userId < 0) {
      return;
    }

    this.userService.getUser(userId).subscribe(response => {
      if (response.status === 200) {
        this.user = response.data;
      }
    });

    this.beverageService.getBeverages().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.beverages = response.data;
      }
    });

    this.txnService.getBeverageTxnsByUser(userId).subscribe(res => {
      if (res.ok && res.data) {
        this.transactions = res.data;
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

    this.txnService.orderBeverage(this.user, beverage).subscribe(response => {
      if (response.ok) {
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
    this.txnService.deleteBeverageTxn(txn).subscribe(res => {
      if (res.ok) {
        // Give the DB some time to process the deletion.
        setTimeout(() => {
          this.loadData(this.user?.id || -1);
        }, 100);
      }
    });
  }
}
