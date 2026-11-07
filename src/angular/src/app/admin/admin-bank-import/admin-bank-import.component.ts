import {Component, OnInit} from '@angular/core';
import {
  faCheck,
  faCog,
  faFileInvoiceDollar,
  faFilePdf,
  faHistory,
  faSyncAlt,
  faTrashAlt,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import {BankImportService} from '../../services/bank-import.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {
  BankCsvPreviewRow,
  BankImportConfirmItem,
  BankImportRecord,
  BankUserMapping,
  InvoiceSettings
} from '../../models/bank-import';
import {Util} from '../../util';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-admin-bank-import',
  templateUrl: './admin-bank-import.component.html',
  styles: []
})
export class AdminBankImportComponent implements OnInit {

  activeTab: 'import' | 'history' | 'settings' = 'import';

  users: User[] = [];
  previewRows: BankCsvPreviewRow[] = [];
  showIgnored = false;
  lastImportedRecords: BankImportRecord[] = [];

  history: BankImportRecord[] = [];
  historySearch = '';

  invoiceSettings: InvoiceSettings = {
    prefix: 'RE-',
    padding: 4,
    next_counter: 1,
  };
  latexTemplate = '';
  mappings: BankUserMapping[] = [];

  isProcessing = false;
  statusMessage = '';
  statusType: 'success' | 'warning' | 'danger' | 'info' = 'info';

  moneyFormat = Util.moneyFormat;

  icons = {
    invoice: faFileInvoiceDollar,
    upload: faUpload,
    history: faHistory,
    cog: faCog,
    pdf: faFilePdf,
    check: faCheck,
    sync: faSyncAlt,
    trash: faTrashAlt,
  };

  constructor(
    private bankImportService: BankImportService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadSettings();
    this.loadHistory();
  }

  switchTab(tab: 'import' | 'history' | 'settings'): void {
    this.activeTab = tab;
    this.statusMessage = '';
    if (tab === 'history') {
      this.loadHistory();
    } else if (tab === 'settings') {
      this.loadSettings();
    }
  }

  loadUsers(): void {
    this.userService.getUsersAdmin().subscribe(res => {
      if (res.status === 200 && res.data) {
        this.users = res.data;
      }
    });
  }

  loadSettings(): void {
    this.bankImportService.getSettings().subscribe(res => {
      if (res.status === 200 && res.data) {
        this.invoiceSettings = res.data.settings;
        this.latexTemplate = res.data.template;
        this.mappings = res.data.mappings || [];
      }
    });
  }

  loadHistory(): void {
    this.bankImportService.getHistory().subscribe(res => {
      if (res.status === 200 && res.data) {
        this.history = res.data.map(r => ({...r, selected: false}));
      }
    });
  }

  // ==================== CSV UPLOAD & PREVIEW ====================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      let csvText: string;
      try {
        const utf8Decoder = new TextDecoder('utf-8', {fatal: true});
        csvText = utf8Decoder.decode(buffer);
      } catch {
        const latin1Decoder = new TextDecoder('iso-8859-1');
        csvText = latin1Decoder.decode(buffer);
      }
      this.runPreview(csvText);
    };

    reader.readAsArrayBuffer(file);
  }

  runPreview(csvContent: string): void {
    this.isProcessing = true;
    this.statusMessage = '';
    this.lastImportedRecords = [];

    this.bankImportService.previewCsv(csvContent).subscribe(res => {
      this.isProcessing = false;
      if (res.status === 200 && res.data) {
        this.previewRows = res.data.map(row => ({
          ...row,
          selectedUser: row.suggestedUser || '',
          selected: row.status === 'matched' && !!row.suggestedUser,
          rememberMapping: true,
        }));
      } else {
        this.setStatus('CSV konnte nicht gelesen werden. Bitte Format (z. B. Betrag-Spalte) prüfen.', 'danger');
      }
    });
  }

  visiblePreviewRows(): BankCsvPreviewRow[] {
    return this.previewRows.filter(r => this.showIgnored || r.status !== 'ignored');
  }

  countByStatus(status: 'matched' | 'unmatched' | 'duplicate' | 'ignored'): number {
    return this.previewRows.filter(r => r.status === status).length;
  }

  onUserSelectionChange(row: BankCsvPreviewRow): void {
    row.selected = !!row.selectedUser && row.status !== 'duplicate' && row.status !== 'ignored';
  }

  selectedImportRows(): BankCsvPreviewRow[] {
    return this.previewRows.filter(
      r => r.selected && !!r.selectedUser && r.status !== 'duplicate' && r.status !== 'ignored' && r.amount > 0
    );
  }

  selectedImportTotal(): number {
    return this.selectedImportRows().reduce((sum, r) => sum + r.amount, 0);
  }

  confirmSelectedImports(): void {
    const selected = this.selectedImportRows();
    if (selected.length === 0) {
      return;
    }

    const items: BankImportConfirmItem[] = selected.map(r => ({
      fingerprint: r.fingerprint,
      bookingDate: r.bookingDate,
      bankName: r.bankName,
      bankIban: r.bankIban,
      purpose: r.purpose,
      amount: r.amount,
      user: r.selectedUser || '',
      rememberMapping: r.rememberMapping !== false,
    }));

    this.isProcessing = true;
    this.statusMessage = '';

    this.bankImportService.confirmImport(items).subscribe(res => {
      this.isProcessing = false;
      if (res.status === 200 && res.data) {
        this.lastImportedRecords = res.data;
        const importedFingerprints = new Set(res.data.map(d => d.fingerprint));
        const invoiceByFp = new Map(res.data.map(d => [d.fingerprint, d.invoice_number]));

        for (const row of this.previewRows) {
          if (importedFingerprints.has(row.fingerprint)) {
            row.status = 'duplicate';
            row.selected = false;
            row.existingInvoiceNumber = invoiceByFp.get(row.fingerprint);
          }
        }

        this.loadUsers();
        this.loadSettings();
        this.loadHistory();
        this.setStatus(
          `${res.data.length} Zahlung(en) erfolgreich verbucht und als LaTeX-PDF unter data/invoices/ gespeichert.`,
          'success'
        );
      } else {
        this.setStatus(
          'Fehler beim Buchen oder Kompilieren der LaTeX-PDF. Bitte LaTeX-Template und Server-Log prüfen.',
          'danger'
        );
      }
    });
  }

  // ==================== HISTORY & PDF DOWNLOAD ====================

  filteredHistory(): BankImportRecord[] {
    const q = this.historySearch.trim().toLowerCase();
    if (!q) {
      return this.history;
    }
    return this.history.filter(r =>
      r.invoice_number.toLowerCase().includes(q) ||
      r.user.toLowerCase().includes(q) ||
      (r.bank_name || '').toLowerCase().includes(q) ||
      (r.bank_iban || '').toLowerCase().includes(q) ||
      (r.purpose || '').toLowerCase().includes(q) ||
      (r.booking_date || '').toLowerCase().includes(q)
    );
  }

  selectedOrFilteredHistory(): BankImportRecord[] {
    const filtered = this.filteredHistory();
    const explicitlySelected = filtered.filter(r => r.selected);
    return explicitlySelected.length > 0 ? explicitlySelected : filtered;
  }

  allHistorySelected(): boolean {
    const filtered = this.filteredHistory();
    return filtered.length > 0 && filtered.every(r => !!r.selected);
  }

  toggleSelectAllHistory(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    for (const r of this.filteredHistory()) {
      r.selected = checked;
    }
  }

  downloadSinglePdf(record: BankImportRecord, recompile: boolean = false): void {
    this.bankImportService.downloadInvoicePdf(record.id, recompile).subscribe(res => {
      if (res.status === 200 && res.data) {
        saveAs(res.data, `${record.invoice_number}.pdf`);
      } else {
        this.setStatus(`PDF für ${record.invoice_number} konnte nicht erstellt werden.`, 'danger');
      }
    });
  }

  downloadBatchPdfForRecords(records: BankImportRecord[]): void {
    if (!records || records.length === 0) {
      return;
    }
    const ids = records.map(r => r.id);
    this.isProcessing = true;
    this.bankImportService.downloadBatchPdf(ids).subscribe(res => {
      this.isProcessing = false;
      if (res.status === 200 && res.data) {
        saveAs(res.data, `Rechnungen-Sammelexport-${records.length}.pdf`);
      } else {
        this.setStatus('Sammel-PDF konnte nicht kompiliert werden.', 'danger');
      }
    });
  }

  // ==================== SETTINGS & LATEX TEMPLATE ====================

  formatInvoicePreview(): string {
    const prefix = this.invoiceSettings.prefix ?? '';
    const padding = Math.max(1, Number(this.invoiceSettings.padding) || 4);
    const nextCounter = Math.max(1, Number(this.invoiceSettings.next_counter) || 1);
    return `${prefix}${String(nextCounter).padStart(padding, '0')}`;
  }

  saveSettingsAndTemplate(): void {
    this.isProcessing = true;
    this.bankImportService.updateSettings(this.invoiceSettings, this.latexTemplate).subscribe(res => {
      this.isProcessing = false;
      if (res.status === 200 && res.data) {
        this.invoiceSettings = res.data.settings;
        this.latexTemplate = res.data.template;
        this.mappings = res.data.mappings || [];
        this.setStatus('Rechnungsschema und LaTeX-Template erfolgreich gespeichert.', 'success');
      } else {
        this.setStatus('Fehler beim Speichern der Einstellungen.', 'danger');
      }
    });
  }

  previewSamplePdf(): void {
    this.isProcessing = true;
    this.bankImportService.downloadSamplePdf(this.latexTemplate).subscribe(res => {
      this.isProcessing = false;
      if (res.status === 200 && res.data) {
        saveAs(res.data, `Vorschau-${this.formatInvoicePreview()}.pdf`);
      } else {
        this.setStatus('LaTeX-Kompilierung fehlgeschlagen! Bitte Syntax im Template prüfen.', 'danger');
      }
    });
  }

  removeMapping(bankIdentifier: string): void {
    this.bankImportService.deleteMapping(bankIdentifier).subscribe(res => {
      if (res.status === 200 && res.data) {
        this.mappings = res.data;
      }
    });
  }

  private setStatus(message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.statusMessage = message;
    this.statusType = type;
  }
}
