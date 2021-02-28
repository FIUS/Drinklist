import {IAppConfig} from './models/i-app-config';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class AppConfig {
  static config: IAppConfig;

  constructor(
    private http: HttpClient,
  ) {
  }

  load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get<IAppConfig>(`${environment.host}/settings`).subscribe((config) => {
        AppConfig.config = config;
        resolve();
      }, (response: any) => {
        reject(`Could not get /settings: ${JSON.stringify(response)}`);
      });
    });
  }
}
