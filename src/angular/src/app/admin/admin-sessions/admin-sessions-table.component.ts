import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Session} from '../../models/session';
import jwtDecode from 'jwt-decode';
import {JwtClaims} from '../../models/jwt-claims';

@Component({
  selector: 'app-admin-sessions-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col" class="text-right" style="width: 2.5%">#</th>
          <th scope="col" style="width: 15%">Token ID</th>
          <th scope="col" style="width: 7.5%">Role</th>
          <th scope="col" style="width: 40%">User Agent</th>
          <th scope="col" style="width: 15%">Referrer</th>
          <th scope="col" style="width: 10%">Client-IP</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th class="text-right">{{sessions.filter(matchesSearch, this).length}}</th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.jti"></th>
          <th>
            <select class="form-control" [(ngModel)]="search.permissions">
              <option value="any">any</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.userAgent"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.referrer"></th>
          <th><input class="form-control text-right" placeholder="Search..." [(ngModel)]="search.clientIP"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr app-admin-sessions-table-entry *ngFor="let session of sessions.filter(matchesSearch, this); index as i"
            [session]="session" [number]="i + 1" [refresh]="refresh" [class.table-success]="isOwnToken(session)"></tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class AdminSessionsTableComponent implements OnInit {

  sessions: Session[] = [];

  search = {
    jti: '',
    permissions: 'any',
    userAgent: '',
    referrer: '',
    clientIP: '',
  };

  constructor(
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  refresh = () => this.loadSessions();

  private loadSessions(): void {
    this.auth.getSessions().subscribe({
      next: tokens => {
        this.sessions = tokens;
      },
      error: err => {
        console.error('error retrieving active sessions: ', err);
      }
    });
  }

  matchesSearch(session: Session): boolean {
    const claims = jwtDecode<JwtClaims>(session.token);
    const permissions = claims.roles.includes('admin') ? 'admin' : 'user';

    const matchesJti = claims.jti.includes(this.search.jti);
    const matchesPermissions = permissions === this.search.permissions || this.search.permissions === 'any';
    const matchesUserAgent = session.userAgent.toLowerCase().includes(this.search.userAgent.toLowerCase());
    const matchesReferrer = session.referrer.toLowerCase().includes(this.search.referrer.toLowerCase());
    const matchesClientIP = session.clientIp.includes(this.search.clientIP);

    return matchesJti && matchesPermissions && matchesUserAgent && matchesReferrer && matchesClientIP;
  }

  isOwnToken(session: Session): boolean {
    return session.token === this.auth.getToken();
  }
}
