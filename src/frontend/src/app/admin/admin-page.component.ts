import {Component, OnInit, Type} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {faBeer, faHistory, faHome, faKey, faUsers} from '@fortawesome/free-solid-svg-icons';
import {AdminPageModule} from './admin-page-module';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {AdminBeveragesComponent} from './admin-beverages/admin-beverages.component';
import {AdminHistoryComponent} from './admin-history/admin-history.component';
import {AdminUsersComponent} from './admin-users/admin-users.component';
import {AdminTokensComponent} from './admin-tokens/admin-tokens.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  public activeModule: string | undefined;
  public activeModuleComponent!: Type<any>;

  public modules: AdminPageModule[] = [
    {
      id: 'dashboard',
      displayName: 'Dashboard',
      icon: faHome,
      spacerAfter: true,
      component: AdminDashboardComponent,
    },
    {
      id: 'beverages',
      displayName: 'Beverages',
      icon: faBeer,
      spacerAfter: false,
      component: AdminBeveragesComponent,
    },
    {
      id: 'history',
      displayName: 'History',
      icon: faHistory,
      spacerAfter: false,
      component: AdminHistoryComponent,
    },
    {
      id: 'users',
      displayName: 'Users',
      icon: faUsers,
      spacerAfter: false,
      component: AdminUsersComponent,
    },
    {
      id: 'tokens',
      displayName: 'Active Tokens',
      icon: faKey,
      spacerAfter: false,
      component: AdminTokensComponent,
    },
  ];

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.activeModule = params.module;
      const activeModule = this.modules.find(module => {
        return module.id === this.activeModule;
      });
      if (activeModule && activeModule.component) {
        this.activeModuleComponent = activeModule.component;
      }
    });
  }
}
