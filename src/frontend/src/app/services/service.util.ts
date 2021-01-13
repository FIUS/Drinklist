import {map, tap} from 'rxjs/operators';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ApiResponse} from '../models/api-response';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';

export const toApiResponse = <T = null>() => map((value: HttpResponse<T>) => {
  return new ApiResponse(value.status, value.body);
});

export const handleError = <T = null>() => {
  return (err: HttpErrorResponse): Observable<ApiResponse<T>> => {
    console.error(err);

    return of(new ApiResponse<T>(err.status, null));
  };
};

export const handleForbiddenUser = (auth: AuthService) => tap((value: ApiResponse<any>) => {
  if (value.status === 403) {
    auth.logoutUser();
  }
});

export const handleForbiddenAdmin = (auth: AuthService) => tap((value: ApiResponse<any>) => {
  if (value.status === 403 || value.status === 401) {
    auth.logoutAdmin();
  }
});

export class ServiceUtil {
  constructor(
    private auth: AuthService,
  ) {
  }

  getTokenHeaders(type: 'user' | 'admin'): HttpHeaders {
    let token: string;
    switch (type) {
      case 'admin':
        token = this.auth.getAdminToken() || '';
        break;
      case 'user':
        token = this.auth.getUserToken() || '';
        break;
    }
    return new HttpHeaders({'X-Auth-Token': token});
  }
}
