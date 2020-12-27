import {Component, OnInit} from '@angular/core';
import {LocaleService} from '../services/locale.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Component({
  selector: 'app-user-list-page',
  template: `
    <header class="text-center">
      <h1 class="display-1">{{locale.getMessage('header1')}}</h1>
    </header>
    <main>
      <div class="container">
        <input class="form-control" placeholder="User" [(ngModel)]="searchTerm">
      </div>
      <div class="row mx-0">
        <ng-container *ngFor="let user of users">
          <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <button class="btn btn-lg btn-block mt-2" [class.btn-warning]="matchesSearch(user.name)"
                    [routerLink]="'/user/' + user.name">{{user.name}}</button>
          </div>
        </ng-container>
      </div>
    </main>
  `,
  styles: []
})
export class UserListPageComponent implements OnInit {

  searchTerm = '';

  users: User[] = [];

  constructor(
    public locale: LocaleService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.users = response.data;
      }
    });
  }

  matchesSearch(name: string): boolean {
    return name.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

}
