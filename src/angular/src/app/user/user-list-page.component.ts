import {Component, OnInit} from '@angular/core';
import {LocaleService} from '../services/locale.service';
import {UserService} from '../services/user.service';
import {AppConfig} from '../app.config';
import {User} from '../models/user';
import {TransactionsService} from '../services/transactions.service';
import {BeverageTransaction} from '../models/beverage-transaction';

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
        <ng-container *ngFor="let user of users">
          <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <button class="btn btn-lg btn-block mt-2" [class.btn-warning]="matchesSearch(user)"
                    [routerLink]="'/user/' + user.id">{{user.name}}</button>
          </div>
        </ng-container>
      </div>
    </main>
    <footer *ngIf="tickerEnabled" class="container-fluid fixed-bottom border-top bg-white">
      <div class="h5 mt-2">
        <span class="font-weight-bold mb-0">{{locale.getMessage('rlabel')}}</span>
        <div class="ticker">
          <div *ngFor="let item of tickerItems">
            {{(item.user$ | async)?.name}}: {{(item.beverage$ | async)?.name}} @ {{item.timestamp | date: 'd.MM.yyyy HH:mm'}} </div>
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
  users: User[] = [];

  get tickerEnabled(): boolean {
    return AppConfig.config.recentlyPurchased;
  }

  tickerItems: BeverageTransaction[] = [];

  constructor(
    public locale: LocaleService,
    private userService: UserService,
    private txnService: TransactionsService,
  ) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.users = response.data;
      }
    });
    if (this.tickerEnabled) {
      this.txnService.getBeverageTxns(3).subscribe(res => {
        if (res.ok && res.data) {
          this.tickerItems = res.data;
        }
      });
    }
  }

  matchesSearch(user: User): boolean {
    return user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

}
