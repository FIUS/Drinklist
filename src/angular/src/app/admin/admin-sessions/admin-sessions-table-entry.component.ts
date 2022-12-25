import {Component, Input, OnInit} from '@angular/core';
import {Session} from '../../models/session';
import {faBan} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../services/auth.service';
import {JwtClaims} from '../../models/jwt-claims';
import jwtDecode from 'jwt-decode';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-admin-sessions-table-entry]',
  template: `
    <th scope="row" class="text-end">{{number}}</th>
    <td>{{claims.jti}}</td>
    <td>{{isAdminSession() ? 'Admin' : 'User'}}</td>
    <td>{{session.userAgent}}</td>
    <td>{{session.referrer}}</td>
    <td class="text-end pe-3">{{session.clientIp}}</td>
    <td>
      <button class="btn btn-sm btn-warning w-100" (click)="revokeConfirmation.open()">
        <fa-icon [icon]="icons.ban"></fa-icon>
        Revoke Session
      </button>
    </td>
    <app-admin-confirmation-modal #revokeConfirmation [callback]="revokeSession">
      <span *ngIf="isOwnSession()" class="h2 text-danger d-block"><strong>WARNING: THIS IS YOUR OWN SESSION!</strong></span>
      Do you really want to revoke {{isAdminSession() ? 'admin' : 'user'}} session with token ID <strong>{{claims.jti}}</strong>?<br>
      The client with this token will no longer be able to perform any action and be prompted for re-login on the next API call.
    </app-admin-confirmation-modal>
  `,
  styles: []
})
export class AdminSessionsTableEntryComponent implements OnInit {
  @Input() session!: Session;
  @Input() number = -1;

  claims!: JwtClaims;

  @Input() refresh!: () => void;

  // FontAwesome icons
  icons = {
    ban: faBan,
  };

  constructor(
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.claims = jwtDecode<JwtClaims>(this.session.token);
  }

  revokeSession = () => this.auth.revokeSession(this.session).subscribe({
    next: () => {
      this.refresh();
    },
    error: err => {
      console.error('could not revoke session!', err);
    }
  });

  isAdminSession(): boolean {
    return this.claims.roles.includes('admin');
  }

  isOwnSession(): boolean {
    return this.claims.jti === this.auth.getTokenId();
  }
}
