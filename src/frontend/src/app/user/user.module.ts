import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserListPageComponent} from './user-list-page.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { UserDetailPageComponent } from './user-detail-page.component';


@NgModule({
  declarations: [
    UserListPageComponent,
    UserDetailPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    UserListPageComponent,
  ]
})
export class UserModule {
}
