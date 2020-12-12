import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserLoginComponent} from './user-login.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    UserLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class LoginModule {
}
