import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {Type} from '@angular/core';
import {faBeer, faCog, faHistory, faHome, faKey, faUsers} from '@fortawesome/free-solid-svg-icons';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {AdminBeveragesComponent} from './admin-beverages/admin-beverages.component';
import {AdminCashTransactionComponent} from './admin-cash-transactions/admin-cash-transaction.component';
import {AdminBeverageTransactionComponent} from './admin-beverage-transactions/admin-beverage-transaction.component';
import {AdminUsersComponent} from './admin-users/admin-users.component';
import {AdminSessionsComponent} from './admin-sessions/admin-sessions.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';

interface AdminSubpage {
  path: string;
  displayName: string;
  icon: IconDefinition;
  spacerAfter: boolean;
  component?: Type<any>;
}

export const subpages: AdminSubpage[] = [
  {
    path: 'dashboard',
    displayName: 'Dashboard',
    icon: faHome,
    spacerAfter: true,
    component: AdminDashboardComponent,
  },
  {
    path: 'beverages',
    displayName: 'Beverages',
    icon: faBeer,
    spacerAfter: false,
    component: AdminBeveragesComponent,
  },
  {
    path: 'cash-transaction',
    displayName: 'History (Cash)',
    icon: faHistory,
    spacerAfter: false,
    component: AdminCashTransactionComponent,
  },
  {
    path: 'beverage-transaction',
    displayName: 'History (Beverages)',
    icon: faHistory,
    spacerAfter: false,
    component: AdminBeverageTransactionComponent,
  },
  {
    path: 'users',
    displayName: 'Users',
    icon: faUsers,
    spacerAfter: false,
    component: AdminUsersComponent,
  },
  {
    path: 'sessions',
    displayName: 'Active Sessions',
    icon: faKey,
    spacerAfter: true,
    component: AdminSessionsComponent,
  },
  {
    path: 'settings',
    displayName: 'Settings',
    icon: faCog,
    spacerAfter: true,
    component: AdminSettingsComponent,
  }
];
