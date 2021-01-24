import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Token} from '../../models/token';

@Component({
  selector: 'app-admin-tokens-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col" class="text-right" style="width: 2.5%">#</th>
          <th scope="col" style="width: 15%">Token</th>
          <th scope="col" style="width: 7.5%">Permissions</th>
          <th scope="col" style="width: 40%">User Agent</th>
          <th scope="col" style="width: 15%">Referrer</th>
          <th scope="col" style="width: 10%">Client-IP</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th class="text-right">{{tokens.filter(matchesSearch, this).length}}</th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.token"></th>
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
        <tr app-admin-tokens-table-entry *ngFor="let token of tokens.filter(matchesSearch, this); index as i"
            [token]="token" [number]="i + 1" [refresh]="refresh" [class.table-success]="isOwnToken(token)"></tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class AdminTokensTableComponent implements OnInit {

  tokens: Token[] = [];

  search = {
    token: '',
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
    this.loadTokens();
  }

  refresh = () => this.loadTokens();

  private loadTokens(): void {
    this.auth.getTokens().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.tokens = response.data;
      }
    });
  }

  matchesSearch(token: Token): boolean {
    const permissions = token.root ? 'admin' : 'user';

    const matchesToken = token.token.includes(this.search.token);
    const matchesPermissions = permissions === this.search.permissions || this.search.permissions === 'any';
    const matchesUserAgent = token.useragent.toLowerCase().includes(this.search.userAgent.toLowerCase());
    const matchesReferrer = token.referrer.toLowerCase().includes(this.search.referrer.toLowerCase());
    const matchesClientIP = token.userip.includes(this.search.clientIP);

    return matchesToken && matchesPermissions && matchesUserAgent && matchesReferrer && matchesClientIP;
  }

  isOwnToken(token: Token): boolean {
    return token.token === this.auth.getAdminToken();
  }
}
