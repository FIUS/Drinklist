import {Component, OnInit, Type} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {faBeer, faCog, faDownload, faHistory, faHome, faKey, faUsers} from '@fortawesome/free-solid-svg-icons';
import {AdminPageModule} from './admin-page-module';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {AdminBeveragesComponent} from './admin-beverages/admin-beverages.component';
import {AdminCashTransactionComponent} from './admin-cash-transactions/admin-cash-transaction.component';
import {AdminUsersComponent} from './admin-users/admin-users.component';
import {AdminTokensComponent} from './admin-tokens/admin-tokens.component';
import {BackupService} from '../services/backup.service';
import {saveAs} from 'file-saver';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import {AdminBeverageTransactionComponent} from './admin-beverage-transactions/admin-beverage-transaction.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  activeModule: string | undefined;
  activeModuleComponent!: Type<any>;

  modules: AdminPageModule[] = [
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
      id: 'cash-transaction',
      displayName: 'History (Cash)',
      icon: faHistory,
      spacerAfter: false,
      component: AdminCashTransactionComponent,
    },
    {
      id: 'beverage-transaction',
      displayName: 'History (Beverages)',
      icon: faHistory,
      spacerAfter: false,
      component: AdminBeverageTransactionComponent,
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
      spacerAfter: true,
      component: AdminTokensComponent,
    },
    {
      id: 'settings',
      displayName: 'Settings',
      icon: faCog,
      spacerAfter: true,
      component: AdminSettingsComponent,
    }
  ];

  // FontAwesome icons
  icons = {
    download: faDownload,
  };

  constructor(
    private route: ActivatedRoute,
    private backupService: BackupService,
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

  downloadDB(): void {
    this.backupService.getDatabaseBackup().subscribe(response => {
      if (response.status === 200 && response.data) {
        saveAs(response.data, `dump-${Date.now()}.sql`);
      }
    });
  }
}
