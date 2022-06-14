import {Component} from '@angular/core';
import {faKey} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-sessions',
  template: `
    <div class="container-fluid">
      <h1>
        <fa-icon [icon]="icons.key"></fa-icon>
        Active Sessions
      </h1>
      <app-admin-sessions-table></app-admin-sessions-table>
    </div>
  `,
  styles: []
})
export class AdminSessionsComponent {

  // FontAwesome icons
  icons = {
    key: faKey,
  };

  constructor() {
  }

}
