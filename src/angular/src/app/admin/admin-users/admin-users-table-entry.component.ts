import {Component, Input} from '@angular/core';
import {User} from '../../models/user';
import {Util} from '../../util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-admin-users-table-entry]',
  template: `
    <th class="text-right pr-3">{{user.id}}</th>
    <td>{{user.name}}</td>
    <td class="text-right pr-3" [class.text-danger]="user.balance < 0"
        [class.text-success]="user.balance > 0" [class.font-weight-bold]="user.balance < -2000">{{moneyFormat(user.balance)}}</td>
    <td class="pl-4">{{!!user.hidden ? 'hidden' : 'visible'}}</td>
    <td>
      <app-admin-users-actions [user]="user" [refresh]="refresh"></app-admin-users-actions>
    </td>
  `,
  styles: []
})
export class AdminUsersTableEntryComponent {
  @Input() user!: User;

  @Input() refresh!: () => void;

  // Aliases for template access
  moneyFormat = Util.moneyFormat;

  constructor() {
  }

}
