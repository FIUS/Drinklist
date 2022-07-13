import {Injectable} from '@angular/core';
import {ILocale, ILocaleData} from '../models/i-locale';
import {HttpClient} from '@angular/common/http';

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
    this.http.get<ILocaleData>(`/assets/locales/${locale}.json`).subscribe((localeData) => {
      this.locale = localeData;
    });
  }

  getLocales(): Promise<ILocale[]> {
    return new Promise<ILocale[]>((resolve) => {
      if (this.locales.length > 0) {
        return resolve(this.locales);
      }
      this.http.get<ILocale[]>('/assets/locales.json').subscribe((response) => {
        this.locales = response;
        return resolve(response);
      });
    });
  }

  getMessage(key: string): string {
    return this.locale[key];
  }
}
