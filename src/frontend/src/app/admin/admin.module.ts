import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminPageComponent} from './admin-page.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AdminStatComponent} from './admin-dashboard/admin-stat.component';
import {AdminStatCounterComponent} from './admin-dashboard/admin-stat-counter.component';
import {AdminStatBeverageToplistComponent} from './admin-dashboard/admin-stat-beverage-toplist.component';
import {AdminStatUserToplistComponent} from './admin-dashboard/admin-stat-user-toplist.component';


@NgModule({
  declarations: [
    AdminPageComponent,
    AdminDashboardComponent,
    AdminStatComponent,
    AdminStatCounterComponent,
    AdminStatBeverageToplistComponent,
    AdminStatUserToplistComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
  ]
})
export class AdminModule {
}
