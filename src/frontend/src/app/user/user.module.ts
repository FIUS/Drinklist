import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserListPageComponent} from './user-list-page.component';


@NgModule({
  declarations: [
    UserListPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UserListPageComponent
  ]
})
export class UserModule {
}
