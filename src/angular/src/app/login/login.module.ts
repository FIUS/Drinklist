import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserLoginComponent} from './user-login.component';
import {FormsModule} from '@angular/forms';
import {AdminLoginComponent} from './admin-login.component';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    UserLoginComponent,
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
  ]
})
export class LoginModule {
}
