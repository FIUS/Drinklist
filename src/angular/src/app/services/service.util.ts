import {map, tap} from 'rxjs/operators';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ApiResponse} from '../models/api-response';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';

// This will be removed when error handling is refactored
export const toApiResponse = <T = null>() => map((value: HttpResponse<T>) => {
  return new ApiResponse(value.ok, value.status, value.body);
});

// This will be removed when error handling is refactored
export const handleError = <T = null>() => {
  return (err: HttpErrorResponse): Observable<ApiResponse<T>> => {
    console.error(err);

    return of(new ApiResponse<T>(false, err.status, null));
  };
};

// This will be removed when error handling is refactored
export const handleForbiddenUser = (auth: AuthService) => tap((value: ApiResponse<any>) => {
  if (value.status === 401) {
    auth.logout();
  }
});

// This will be removed when error handling is refactored
export const handleForbiddenAdmin = (auth: AuthService) => tap((value: ApiResponse<any>) => {
  if (value.status === 401 || value.status === 403) {
    auth.logout();
  }
});

export class ServiceUtil {
  constructor(
    private auth: AuthService,
  ) {
  }

  getTokenHeaders(type: 'user' | 'admin'): HttpHeaders {
    // TODO: change signature when refactoring error handling
    return new HttpHeaders({'X-Auth-Token': this.auth.getToken() || ''});
  }
}
