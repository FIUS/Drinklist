import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {handleError, handleForbiddenAdmin, ServiceUtil, toApiResponse} from './service.util';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {
  BankCsvPreviewRow,
  BankImportConfirmItem,
  BankImportRecord,
  BankImportSettingsResponse,
  BankUserMapping,
  InvoiceSettings
} from '../models/bank-import';

@Injectable({
  providedIn: 'root'
})
export class BankImportService {

  private readonly api = `${environment.apiRoot}/bank-import`;
  private util: ServiceUtil;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.util = new ServiceUtil(auth);
  }

  previewCsv(csvContent: string): Observable<ApiResponse<BankCsvPreviewRow[]>> {
    return this.http.post<BankCsvPreviewRow[]>(`${this.api}/preview`, {csvContent}, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse<BankCsvPreviewRow[]>(),
      catchError(handleError<BankCsvPreviewRow[]>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  confirmImport(items: BankImportConfirmItem[]): Observable<ApiResponse<BankImportRecord[]>> {
    return this.http.post<BankImportRecord[]>(`${this.api}/confirm`, {items}, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse<BankImportRecord[]>(),
      catchError(handleError<BankImportRecord[]>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  getHistory(): Observable<ApiResponse<BankImportRecord[]>> {
    return this.http.get<BankImportRecord[]>(`${this.api}/history`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse<BankImportRecord[]>(),
      catchError(handleError<BankImportRecord[]>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  downloadInvoicePdf(id: string, recompile: boolean = false): Observable<ApiResponse<Blob>> {
    const query = recompile ? '?recompile=true' : '';
    return this.http.get(`${this.api}/invoice/${id}/pdf${query}`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
      responseType: 'blob',
    }).pipe(
      toApiResponse<Blob>(),
      catchError(handleError<Blob>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  downloadBatchPdf(ids: string[]): Observable<ApiResponse<Blob>> {
    return this.http.post(`${this.api}/invoices/batch-pdf`, {ids}, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
      responseType: 'blob',
    }).pipe(
      toApiResponse<Blob>(),
      catchError(handleError<Blob>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  getSettings(): Observable<ApiResponse<BankImportSettingsResponse>> {
    return this.http.get<BankImportSettingsResponse>(`${this.api}/settings`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse<BankImportSettingsResponse>(),
      catchError(handleError<BankImportSettingsResponse>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  updateSettings(settings: InvoiceSettings, template: string): Observable<ApiResponse<BankImportSettingsResponse>> {
    return this.http.put<BankImportSettingsResponse>(`${this.api}/settings`, {settings, template}, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse<BankImportSettingsResponse>(),
      catchError(handleError<BankImportSettingsResponse>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  downloadSamplePdf(template: string): Observable<ApiResponse<Blob>> {
    return this.http.post(`${this.api}/template/sample-pdf`, {template}, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
      responseType: 'blob',
    }).pipe(
      toApiResponse<Blob>(),
      catchError(handleError<Blob>()),
      handleForbiddenAdmin(this.auth),
    );
  }

  deleteMapping(bankIdentifier: string): Observable<ApiResponse<BankUserMapping[]>> {
    return this.http.delete<BankUserMapping[]>(`${this.api}/mappings?id=${encodeURIComponent(bankIdentifier)}`, {
      observe: 'response',
      headers: this.util.getTokenHeaders('admin'),
    }).pipe(
      toApiResponse<BankUserMapping[]>(),
      catchError(handleError<BankUserMapping[]>()),
      handleForbiddenAdmin(this.auth),
    );
  }
}
