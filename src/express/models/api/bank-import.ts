export interface BankCsvPreviewRow {
  rowIndex: number;
  fingerprint: string;
  bookingDate: string;
  bankName: string;
  bankIban: string;
  purpose: string;
  amount: number;
  status: 'matched' | 'unmatched' | 'duplicate' | 'ignored';
  matchSource: 'purpose' | 'mapping' | 'fuzzy_name' | 'none';
  suggestedUser: string;
  existingInvoiceNumber?: string;
}

export interface BankImportConfirmItem {
  fingerprint: string;
  bookingDate: string;
  bankName: string;
  bankIban: string;
  purpose: string;
  amount: number;
  user: string;
  rememberMapping?: boolean;
}

export interface BankImportRecord {
  id: string;
  fingerprint: string;
  invoice_number: string;
  history_id: string;
  user: string;
  booking_date: string;
  bank_name: string;
  bank_iban: string;
  purpose: string;
  amount: number;
  old_balance: number;
  new_balance: number;
  pdf_path: string;
  created_at: string;
}

export interface InvoiceSettings {
  prefix: string;
  padding: number;
  next_counter: number;
}

export interface BankUserMapping {
  bank_identifier: string;
  user: string;
  updated_at: string;
}
