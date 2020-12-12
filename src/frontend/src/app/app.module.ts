import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {LoginModule} from './login/login.module';
import {UserModule} from './user/user.module';
import {AppConfig} from './app.config';

export function initializeApp(appConfig: AppConfig): () => Promise<void> {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // External Modules
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    // Routing Module
    AppRoutingModule,
    // Internal Modules
    LoginModule,
    UserModule,
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
