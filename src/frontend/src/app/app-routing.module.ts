import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserListPageComponent} from './user/user-list-page.component';
import {UserLoginComponent} from './login/user-login.component';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      // Common section
      {
        path: '',
        component: UserListPageComponent,
      },
      {
        path: 'user/:username',
        component: UserListPageComponent, // TODO: implement user page
      }
    ],
  },
  // Admin section
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UserListPageComponent, // TODO: implement admin interfaces
      },
      {
        path: 'page',
        component: UserListPageComponent, // TODO: testing only
      }
    ],
  },
  // Login pages
  {
    path: 'admin/login',
    component: UserLoginComponent, // TODO: separate admin login page
  },
  {
    path: 'login',
    component: UserLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
