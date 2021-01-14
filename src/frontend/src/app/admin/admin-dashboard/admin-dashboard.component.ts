import {Component, OnInit} from '@angular/core';
import {faBeer, faMoneyBill, faUsers} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../services/user.service';
import {BeverageService} from '../../services/beverage.service';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <h1>Admin Dashboard</h1>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col mb-4">
        <app-admin-stat-counter title="Total Users" [icon]="icons.users" [count]="userCount || -1" counted="users"></app-admin-stat-counter>
      </div>
      <div class="col mb-4">
        <app-admin-stat-counter title="Total Beverages" [icon]="icons.beer" [count]="beverageCount || -1"
                                counted="beverages"></app-admin-stat-counter>
      </div>
      <div class="col mb-4">
        <app-admin-stat-counter title="Total Transactions" [icon]="icons.moneyBill" [count]="orderCount || -1"
                                counted="transactions"></app-admin-stat-counter>
      </div>
      <div class="col mb-4">
        <app-admin-stat-beverage-toplist></app-admin-stat-beverage-toplist>
      </div>
      <div class="col mb-4">
        <app-admin-stat-user-toplist></app-admin-stat-user-toplist>
      </div>
      <div class="col mb-4">
        <app-admin-stat-user-toplist [debt]="true"></app-admin-stat-user-toplist>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  /**
   * This could be cleaned up by wrapping each stat in its own component
   */

  public userCount: number | undefined;
  public beverageCount: number | undefined;
  public orderCount: number | undefined;

  // FontAwesome icons
  public icons = {
    users: faUsers,
    beer: faBeer,
    moneyBill: faMoneyBill,
  };

  constructor(
    private userService: UserService,
    private beverageService: BeverageService,
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this.userService.getUserCount().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.userCount = response.data;
      }
    });

    this.beverageService.getBeverageCount().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.beverageCount = response.data;
      }
    });

    this.orderService.getOrderCount().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.orderCount = response.data;
      }
    });
  }
}