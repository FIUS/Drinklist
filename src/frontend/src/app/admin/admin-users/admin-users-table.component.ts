import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {Util} from '../../util';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-users-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col" class="text-right" style="width: 2.5%">#</th>
          <th scope="col">Name</th>
          <th scope="col" style="width: 10%">Balance</th>
          <th scope="col" style="width: 10%">Visibility</th>
          <th scope="col" style="width: 25%"></th>
        </tr>
        <tr>
          <th class="text-right">{{users.filter(matchesSearch, this).length}}</th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.name"></th>
          <th><input class="form-control text-right" placeholder="Search..." [(ngModel)]="search.balance"></th>
          <th>
            <select class="form-control" [(ngModel)]="search.visibility">
              <option value="any">any</option>
              <option value="visible">visible</option>
              <option value="hidden">hidden</option>
            </select>
          </th>
          <th>
            <button class="btn btn-warning w-100" (click)="addUser.open()">
              <fa-icon [icon]="icons.plus"></fa-icon>
              Add User
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr app-admin-users-table-entry *ngFor="let user of users.filter(matchesSearch, this); index as i" [user]="user" [number]="i + 1"
            [refresh]="refresh" [class.table-warning]="user.balance < 0 && !user.hidden" [class.table-secondary]="!!user.hidden"></tr>
      </tbody>
    </table>
    <app-admin-user-add [refresh]="refresh" #addUser></app-admin-user-add>
  `,
  styles: []
})
export class AdminUsersTableComponent implements OnInit {

  users: User[] = [];

  search = {
    name: '',
    balance: '',
    visibility: 'any',
  };

  // FontAwesome icons
  icons = {
    plus: faPlus,
  };

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsersAdmin().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.users = response.data;
      }
    });
  }

  refresh = () => {
    this.loadUsers();
  };

  matchesSearch(user: User): boolean {
    const visibility = !!user.hidden ? 'hidden' : 'visible';

    const matchesName = user.name.toLowerCase().includes(this.search.name.toLowerCase());
    const matchesBalance = Util.moneyFormat(user.balance).toLowerCase().includes(this.search.balance) ||
      user.balance.toString().includes(this.search.balance);
    const matchesVisibility = this.search.visibility === visibility || this.search.visibility === 'any';

    return matchesName && matchesBalance && matchesVisibility;
  }

}
