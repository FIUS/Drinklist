import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {Util} from '../../util';

@Component({
  selector: 'app-admin-stat-user-toplist',
  template: `
    <app-admin-stat [title]="'Top ' + (debt ? 'Debtors' : 'Savers')" [text]="text" [ordered]="true" [list]="userList"></app-admin-stat>
  `,
  styles: []
})
export class AdminStatUserToplistComponent implements OnInit {
  @Input() debt = false;

  text = '';

  userList: string[] | undefined;

  constructor(
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.text = `These are the top 5 users with the ${this.debt ? 'lowest' : 'highest'} balance:`;

    if (this.debt) {
      this.userService.getTopDebtors().subscribe(response => {
        if (response.status === 200 && response.data) {
          this.userList = this.prepareToplist(response.data);
        }
      });
    } else {
      this.userService.getTopSavers().subscribe(response => {
        if (response.status === 200 && response.data) {
          this.userList = this.prepareToplist(response.data);
        }
      });
    }
  }

  prepareToplist(users: User[]): string[] {
    return users.map(user => {
      return `${user.name} (${user.balance <= -2000 ? '<strong class="text-danger">' : ''}${Util.moneyFormat(user.balance)}${user.balance <= -2000 ? '</strong>' : ''})`;
    });
  }

}
