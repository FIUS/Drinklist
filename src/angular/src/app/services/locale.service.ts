import {Injectable} from '@angular/core';
import {ILocale, ILocaleData} from '../models/i-locale';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(
    private http: HttpClient,
  ) {
    this.retrieveLocale(this.activeLocale);
  }

  locales: ILocale[] = [];
  locale: ILocaleData = {};

  get activeLocale(): string {
    return localStorage.getItem('locale') || 'en';
  }

  set activeLocale(value: string) {
    this.retrieveLocale(value);
    localStorage.setItem('locale', value);
  }

  private retrieveLocale(locale: string): void {
    this.http.get<ILocaleData>(`/assets/locales/${locale}.json`).subscribe(localeData => {
      this.locale = localeData;
    });
  }

  getLocales(): Observable<ILocale[]> {
    if (this.locales.length > 0) {
      return of(this.locales);
    }
    return this.http.get<ILocale[]>('/assets/locales.json').pipe(
      tap({
        next: locales => {
          this.locales = locales;
        }
      })
    );
  }

  getMessage(key: string): string {
    return this.locale[key];
  }
}
