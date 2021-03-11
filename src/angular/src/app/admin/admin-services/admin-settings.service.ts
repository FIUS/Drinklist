import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {handleError, handleForbiddenAdmin, ServiceUtil, toApiResponse} from '../../services/service.util';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../models/api-response';
import {IAppConfig} from '../../models/i-app-config';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';


@Injectable({
  // We are creating this service directly for the component that uses it
  providedIn: null
})
export class AdminSettingsService {

  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.util = new ServiceUtil(auth);
  }

  save(settings: IAppConfig): Observable<ApiResponse> {
    return this.http.post<null>(`${environment.apiRoot}/settings`, settings, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin')
    }).pipe(
      toApiResponse(),
      catchError(handleError()),
      handleForbiddenAdmin(this.auth),
    );
  }
}
