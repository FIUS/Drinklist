import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {BeverageService} from '../services/beverage.service';
import {Beverage} from '../models/beverage';
import {LocaleService} from '../services/locale.service';
import {Util} from '../util';
import {OrderService} from '../services/order.service';
import {Order} from '../models/order';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';

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
  orders: Order[] = [];

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
  ) {
  }

  private loadData(username: string): void {
    this.userService.getUser(username).subscribe(response => {
      if (response.status === 200) {
        this.user = response.data;
      }
    });

    this.beverageService.getBeverages().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.beverages = response.data;
      }
    });

    this.orderService.getUserOrders(username).subscribe(response => {
      if (response.status === 200 && response.data) {
        this.orders = response.data;
      }
    });
  }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username') || '';

    this.loadData(username);
  }

  getSafeUserBalance(): number {
    return this.user?.balance || 0;
  }

  order(beverage: Beverage): void {
    if (!this.user) {
      return;
    }

    this.orderService.createOrder(this.user, beverage).subscribe(response => {
      if (response.status === 200) {
        // Give the DB some time to process the order.
        setTimeout(() => {
          this.loadData(this.user?.name || '');
        }, 100);
      }
    });
  }

  deleteFreshOrder(order: Order): void {
    if (!order.isFresh()) {
      return;
    }
    this.orderService.deleteRecentOrder(order).subscribe(response => {
      if (response.status === 200) {
        // Give the DB some time to process the deletion.
        setTimeout(() => {
          this.loadData(this.user?.name || '');
        }, 100);
      }
    });
  }
}
