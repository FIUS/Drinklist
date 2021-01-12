import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminPageComponent} from './admin-page.component';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AdminPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
  ]
})
export class AdminModule {
}
