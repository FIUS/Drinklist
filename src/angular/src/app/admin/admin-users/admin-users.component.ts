import {Component} from '@angular/core';
import {faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="container-fluid">
      <h1>
        <fa-icon [icon]="icons.users"></fa-icon>
        Users
      </h1>
      <app-admin-users-table></app-admin-users-table>
    </div>
  `,
  styles: []
})
export class AdminUsersComponent {

  // FontAwesome icons
  icons = {
    users: faUsers,
  };

  constructor() {
  }

}
