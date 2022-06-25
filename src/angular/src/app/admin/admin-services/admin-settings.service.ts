import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {noop, Observable} from 'rxjs';
import {IAppConfig} from '../../models/i-app-config';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';


@Injectable({
  // We are creating this service directly for the component that uses it
  providedIn: null
})
export class AdminSettingsService {

  constructor(
    private http: HttpClient
  ) {
  }

  save(settings: IAppConfig): Observable<void> {
    return this.http.post(`${environment.apiRoot}/settings`, settings).pipe(
      map(noop), // return void
    );
  }
}
