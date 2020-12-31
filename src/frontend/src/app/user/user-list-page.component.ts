import {Component, OnInit} from '@angular/core';
import {LocaleService} from '../services/locale.service';
import {UserService} from '../services/user.service';
import {Order} from '../models/order';
import {OrderService} from '../services/order.service';
import {AppConfig} from '../app.config';
import {AuthService} from '../services/auth.service';
import {User} from '../models/user';

@Component({
  selector: 'app-user-list-page',
  template: `
    <header class="text-center">
      <h1 class="display-1">{{locale.getMessage('header1')}}</h1>
    </header>
    <main class="mb-8vh">
      <div class="container">
        <input class="form-control" placeholder="User" [(ngModel)]="searchTerm">
      </div>
      <div class="row mx-0">
        <ng-container *ngFor="let username of usernames">
          <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <button class="btn btn-lg btn-block mt-2" [class.btn-warning]="matchesSearch(username)"
                    [routerLink]="'/user/' + username">{{username}}</button>
          </div>
        </ng-container>
      </div>
    </main>
    <footer class="container-fluid fixed-bottom border-top bg-white">
      <div class="h5 mt-2">
        <span class="font-weight-bold mb-0">{{locale.getMessage('rlabel')}}</span>
        <div class="ticker">
          <div *ngFor="let item of tickerItems">{{item.user}}: {{item.reason}} @ {{item.timestamp}} </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @keyframes ticker-item {
      0% {
        transform: translateY(200%);
        opacity: 0;
      }
      4% {
        transform: translateY(0);
        opacity: 1;
      }
      31% {
        transform: translateY(0);
        opacity: 1;
      }
      35%, 100% {
        transform: translateY(-200%);
        opacity: 0;
      }
    }

    .ticker {
      width: 100%;
      height: 1.104em;
      overflow: hidden;
      display: block;
      position: relative;
    }

    .ticker > div {
      position: absolute;
      white-space: nowrap;
      display: block;
      opacity: 0;
      animation-name: ticker-item;
      animation-iteration-count: infinite;
      animation-duration: 9s;
    }

    .ticker > div:nth-child(1) {
      animation-delay: 0s;
    }

    .ticker > div:nth-child(2) {
      animation-delay: 3s;
    }

    .ticker > div:nth-child(3) {
      animation-delay: 6s;
    }
  `]
})
export class UserListPageComponent implements OnInit {

  searchTerm = '';
  usernames: string[] = [];

  get tickerEnabled(): boolean {
    return AppConfig.config.settings.history;
  }

  tickerItems: Order[] = [];

  constructor(
    public locale: LocaleService,
    private userService: UserService,
    private orderService: OrderService,
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(response => {
      if (response.status === 200 && response.data) {
        let usernames = response.data;
        if (this.auth.isLoggedIn('admin')) { // Map User objects to usernames if admin
          usernames = (usernames as User[]).map((user => {
            return user.name;
          }));
        }
        this.usernames = usernames as string[];
      }
    });
    if (this.tickerEnabled) {
      this.orderService.getHistory(3).subscribe(response => {
        if (response.status === 200 && response.data) {
          this.tickerItems = response.data;
        }
      });
    }
  }

  matchesSearch(name: string): boolean {
    return name.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

}
