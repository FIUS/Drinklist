import {map} from 'rxjs/operators';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ApiResponse} from '../models/api-response';
import {Observable, of} from 'rxjs';

export const toApiResponse = <T = null>() => map((value: HttpResponse<T>) => {
  return new ApiResponse(value.status, value.body);
});

export const handleError = <T = null>() => {
  return (err: HttpErrorResponse): Observable<ApiResponse<T>> => {
    console.error(err);

    return of(new ApiResponse<T>(err.status, null));
  };
};
