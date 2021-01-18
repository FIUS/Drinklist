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
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NgbCollapseModule,
    AdminModalsModule,
    NgbButtonsModule,
  ]
})
export class AdminModule {
}
