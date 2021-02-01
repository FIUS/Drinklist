import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {handleError, handleForbiddenAdmin, ServiceUtil, toApiResponse} from './service.util';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {AppConfig} from '../app.config';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  private readonly api = AppConfig.config.api;
  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  getDatabaseBackup(): Observable<ApiResponse<Blob>> {
    return this.http.get(`${this.api}/backup`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
      responseType: 'blob'
    }).pipe(
      toApiResponse<Blob>(),
      catchError(handleError<Blob>()),
      handleForbiddenAdmin(this.auth),
    );
  }
}
