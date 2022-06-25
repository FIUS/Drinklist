import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  private readonly api = environment.apiRoot;

  constructor(
    private http: HttpClient,
  ) {
  }

  getDatabaseBackup(): Observable<Blob> {
    return this.http.get(`${this.api}/backup`, {
      responseType: 'blob'
    });
  }
}
