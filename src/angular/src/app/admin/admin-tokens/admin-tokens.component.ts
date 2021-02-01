import {Component} from '@angular/core';
import {faKey} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-tokens',
  template: `
    <div class="container-fluid">
      <h1>
        <fa-icon [icon]="icons.key"></fa-icon>
        Active Tokens
      </h1>
      <app-admin-tokens-table></app-admin-tokens-table>
    </div>
  `,
  styles: []
})
export class AdminTokensComponent {

  // FontAwesome icons
  icons = {
    key: faKey,
  };

  constructor() {
  }

}
