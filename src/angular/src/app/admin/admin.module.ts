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
import {AdminHistoryComponent} from './admin-history/admin-history.component';
import {AdminHistoryTableComponent} from './admin-history/admin-history-table.component';
import {AdminHistoryTableEntryComponent} from './admin-history/admin-history-table-entry.component';
import {AdminHistoryActionsComponent} from './admin-history/admin-history-actions.component';
import {AdminUsersComponent} from './admin-users/admin-users.component';
import {AdminUsersTableComponent} from './admin-users/admin-users-table.component';
import {AdminUsersTableEntryComponent} from './admin-users/admin-users-table-entry.component';
import {AdminUsersActionsComponent} from './admin-users/admin-users-actions.component';
import {AdminTokensComponent} from './admin-tokens/admin-tokens.component';
import {AdminTokensTableComponent} from './admin-tokens/admin-tokens-table.component';
import {AdminTokensTableEntryComponent} from './admin-tokens/admin-tokens-table-entry.component';


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
    AdminHistoryComponent,
    AdminHistoryTableComponent,
    AdminHistoryTableEntryComponent,
    AdminHistoryActionsComponent,
    AdminUsersComponent,
    AdminUsersTableComponent,
    AdminUsersTableEntryComponent,
    AdminUsersActionsComponent,
    AdminTokensComponent,
    AdminTokensTableComponent,
    AdminTokensTableEntryComponent,
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
