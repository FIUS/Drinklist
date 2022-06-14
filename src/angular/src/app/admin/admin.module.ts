import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminPageComponent} from './admin-page.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AdminStatComponent} from './admin-dashboard/admin-stat.component';
import {AdminStatCounterComponent} from './admin-dashboard/admin-stat-counter.component';
import {AdminStatBeverageToplistComponent} from './admin-dashboard/admin-stat-beverage-toplist.component';
import {AdminStatUserToplistComponent} from './admin-dashboard/admin-stat-user-toplist.component';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminBeveragesComponent} from './admin-beverages/admin-beverages.component';
import {NgbButtonsModule, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {AdminBeveragesTableComponent} from './admin-beverages/admin-beverages-table.component';
import {AdminBeveragesTableEntryComponent} from './admin-beverages/admin-beverages-table-entry.component';
import {AdminBeveragesActionsComponent} from './admin-beverages/admin-beverages-actions.component';
import {AdminModalsModule} from './admin-modals/admin-modals.module';
import {FormsModule} from '@angular/forms';
import {AdminCashTransactionComponent} from './admin-cash-transactions/admin-cash-transaction.component';
import {AdminCashTransactionTableComponent} from './admin-cash-transactions/admin-cash-transaction-table.component';
import {AdminCashTransactionTableEntryComponent} from './admin-cash-transactions/admin-cash-transaction-table-entry.component';
import {AdminCashTransactionActionsComponent} from './admin-cash-transactions/admin-cash-transaction-actions.component';
import {AdminUsersComponent} from './admin-users/admin-users.component';
import {AdminUsersTableComponent} from './admin-users/admin-users-table.component';
import {AdminUsersTableEntryComponent} from './admin-users/admin-users-table-entry.component';
import {AdminUsersActionsComponent} from './admin-users/admin-users-actions.component';
import {AdminSessionsComponent} from './admin-sessions/admin-sessions.component';
import {AdminSessionsTableComponent} from './admin-sessions/admin-sessions-table.component';
import {AdminSessionsTableEntryComponent} from './admin-sessions/admin-sessions-table-entry.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import {AdminBeverageTransactionComponent} from './admin-beverage-transactions/admin-beverage-transaction.component';
import {AdminBeverageTransactionTableComponent} from './admin-beverage-transactions/admin-beverage-transaction-table.component';
import {AdminBeverageTransactionActionsComponent} from './admin-beverage-transactions/admin-beverage-transaction-actions.component';
import {AdminBeverageTransactionTableEntryComponent} from './admin-beverage-transactions/admin-beverage-transaction-table-entry.component';


@NgModule({
  declarations: [
    AdminPageComponent,
    AdminDashboardComponent,
    AdminStatComponent,
    AdminStatCounterComponent,
    AdminStatBeverageToplistComponent,
    AdminStatUserToplistComponent,
    AdminBeveragesComponent,
    AdminBeveragesTableComponent,
    AdminBeveragesTableEntryComponent,
    AdminBeveragesActionsComponent,
    AdminCashTransactionComponent,
    AdminCashTransactionTableComponent,
    AdminCashTransactionTableEntryComponent,
    AdminCashTransactionActionsComponent,
    AdminBeverageTransactionComponent,
    AdminBeverageTransactionTableComponent,
    AdminBeverageTransactionTableEntryComponent,
    AdminBeverageTransactionActionsComponent,
    AdminUsersComponent,
    AdminUsersTableComponent,
    AdminUsersTableEntryComponent,
    AdminUsersActionsComponent,
    AdminSessionsComponent,
    AdminSessionsTableComponent,
    AdminSessionsTableEntryComponent,
    AdminSettingsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NgbCollapseModule,
    AdminModalsModule,
    NgbButtonsModule,
    FormsModule,
  ]
})
export class AdminModule {
}
