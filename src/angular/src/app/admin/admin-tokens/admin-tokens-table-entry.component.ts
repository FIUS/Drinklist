import {Component, Input} from '@angular/core';
import {Token} from '../../models/token';
import {faBan} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-admin-tokens-table-entry]',
  template: `
    <th scope="row" class="text-right">{{number}}</th>
    <td>{{token.token}}</td>
    <td>{{token.root ? 'Admin' : 'User'}}</td>
    <td>{{token.useragent}}</td>
    <td>{{token.referrer}}</td>
    <td class="text-right pr-3">{{token.userip}}</td>
    <td>
      <button class="btn btn-sm btn-warning w-100" (click)="revokeConfirmation.open()">
        <fa-icon [icon]="icons.ban"></fa-icon>
        Revoke Token
      </button>
    </td>
    <app-admin-confirmation-modal #revokeConfirmation [callback]="revokeToken">
      <span *ngIf="isOwnToken()" class="h2 text-danger d-block"><strong>WARNING: THIS IS YOUR OWN TOKEN!</strong></span>
      Do you really want to revoke {{token.root ? 'admin' : 'user'}} token <strong>{{token.token}}</strong>?<br>
      The client with this token will no longer be able to perform any action and be prompted for re-login on the next API call.
    </app-admin-confirmation-modal>
  `,
  styles: []
})
export class AdminTokensTableEntryComponent {
  @Input() token!: Token;
  @Input() number = -1;

  @Input() refresh!: () => void;

  // FontAwesome icons
  icons = {
    ban: faBan,
  };

  constructor(
    private auth: AuthService,
  ) {
  }

  revokeToken = () => this.auth.revokeToken(this.token).subscribe(response => {
    if (response.status === 200) {
      this.refresh();
    }
  });

  isOwnToken(): boolean {
    return this.token.token === this.auth.getAdminToken();
  }
}
