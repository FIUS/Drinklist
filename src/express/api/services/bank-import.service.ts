import DbService from '../../services/api/db.service';
import {
  BankCsvPreviewRow,
  BankImportConfirmItem,
  BankImportRecord,
  BankUserMapping,
  InvoiceSettings
} from '../../models/api/bank-import';
import User from '../../models/api/user';
import {RequestError} from '../api.util';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {execFileSync} from 'child_process';
import {v4} from 'uuid';

const DEFAULT_LATEX_TEMPLATE = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[a4paper,margin=2.5cm]{geometry}
\\usepackage{parskip}
\\usepackage{array}

\\pagestyle{empty}

\\begin{document}

\\begin{flushright}
  \\textbf{\\large Drinklist Guthaben-Beleg}\\\\
  \\vspace{0.2cm}
  \\textbf{Rechnungs-Nr.:} {{INVOICE_NUMBER}}\\\\
  \\textbf{Ausstellungsdatum:} {{INVOICE_DATE}}\\\\
  \\textbf{Buchungsdatum:} {{BOOKING_DATE}}
\\end{flushright}

\\vspace{0.8cm}

\\textbf{Empf\\"{a}nger / Nutzerkonto:}\\\\
{{USER_NAME}}\\\\
\\textit{Zahlungseingang von: {{BANK_NAME}} ({{BANK_IBAN}})}

\\vspace{1.0cm}

{\\Large \\textbf{Rechnung / Quittung Nr. {{INVOICE_NUMBER}}}}

\\vspace{0.5cm}

Hiermit best\\"{a}tigen wir den Zahlungseingang per Bank\\"{u}berweisung und die entsprechende Gutschrift auf das Drinklist-Konto.

\\vspace{0.5cm}

\\renewcommand{\\arraystretch}{1.5}
\\begin{tabular}{|p{4.5cm}|p{9.5cm}|}
  \\hline
  \\textbf{Nutzer (Drinklist)} & {{USER_NAME}} \\\\
  \\hline
  \\textbf{Auftraggeber (Bank)} & {{BANK_NAME}} \\\\
  \\hline
  \\textbf{IBAN} & {{BANK_IBAN}} \\\\
  \\hline
  \\textbf{Buchungsdatum} & {{BOOKING_DATE}} \\\\
  \\hline
  \\textbf{Verwendungszweck} & {{PURPOSE}} \\\\
  \\hline
  \\textbf{Alter Kontostand} & {{OLD_BALANCE}} {{CURRENCY}} \\\\
  \\hline
  \\textbf{Gutgeschriebener Betrag} & \\textbf{{{AMOUNT}} {{CURRENCY}}} \\\\
  \\hline
  \\textbf{Neuer Kontostand} & \\textbf{{{NEW_BALANCE}} {{CURRENCY}}} \\\\
  \\hline
\\end{tabular}

\\vspace{1.5cm}

Vielen Dank f\\"{u}r die Aufladung!

\\end{document}
`;

class BankImportService {
  private readonly rootDir = fs.realpathSync('./');
  private readonly templatePath: string;
  private readonly invoicesDir: string;

  constructor(
    private dbService: DbService
  ) {
    this.templatePath = path.join(this.rootDir, 'data', 'invoice-template.tex');
    this.invoicesDir = path.join(this.rootDir, 'data', 'invoices');
    this.ensureDirectoriesAndFiles();
  }

  private ensureDirectoriesAndFiles(): void {
    if (!fs.existsSync(this.invoicesDir)) {
      fs.mkdirSync(this.invoicesDir, {recursive: true});
    }
    if (!fs.existsSync(this.templatePath)) {
      fs.writeFileSync(this.templatePath, DEFAULT_LATEX_TEMPLATE, 'utf8');
    }
  }

  // ==================== SETTINGS & TEMPLATE ====================

  getSettings(): InvoiceSettings {
    const sql = this.dbService.prepare('SELECT prefix, padding, next_counter FROM InvoiceSettings WHERE id = 1;');
    const row = sql.get() as InvoiceSettings | undefined;
    if (!row) {
      return {prefix: 'RE-', padding: 4, next_counter: 1};
    }
    return row;
  }

  updateSettings(settings: InvoiceSettings): InvoiceSettings {
    const prefix = (settings.prefix ?? 'RE-').toString();
    const padding = Math.max(1, Math.min(12, Math.floor(Number(settings.padding) || 4)));
    const nextCounter = Math.max(1, Math.floor(Number(settings.next_counter) || 1));

    const sql = this.dbService.prepare(
      'UPDATE InvoiceSettings SET prefix = ?, padding = ?, next_counter = ? WHERE id = 1;'
    );
    sql.run(prefix, padding, nextCounter);
    return this.getSettings();
  }

  getTemplate(): string {
    this.ensureDirectoriesAndFiles();
    return fs.readFileSync(this.templatePath, 'utf8');
  }

  updateTemplate(template: string): void {
    if (!template || typeof template !== 'string') {
      throw new RequestError(400, 'Invalid LaTeX template');
    }
    this.ensureDirectoriesAndFiles();
    fs.writeFileSync(this.templatePath, template, 'utf8');
  }

  getMappings(): BankUserMapping[] {
    const sql = this.dbService.prepare(
      'SELECT bank_identifier, user, updated_at FROM BankUserMappings ORDER BY updated_at DESC;'
    );
    return sql.all() as BankUserMapping[];
  }

  deleteMapping(bankIdentifier: string): void {
    const sql = this.dbService.prepare('DELETE FROM BankUserMappings WHERE bank_identifier = ?;');
    sql.run(bankIdentifier);
  }

  // ==================== CSV PARSING & PREVIEW ====================

  previewCsv(csvContent: string): BankCsvPreviewRow[] {
    if (!csvContent || typeof csvContent !== 'string') {
      throw new RequestError(400, 'CSV content is empty');
    }

    const parsedRows = this.parseBankCsv(csvContent);
    const users = (this.dbService.prepare('SELECT name, balance, hidden FROM Users ORDER BY name;').all() as User[]);
    const mappingsRows = this.getMappings();
    const mappings = new Map<string, string>();
    for (const m of mappingsRows) {
      mappings.set(m.bank_identifier, m.user);
    }

    const validUserNames = new Set(users.map(u => u.name));
    const checkDuplicateStmt = this.dbService.prepare(
      'SELECT invoice_number FROM BankImports WHERE fingerprint = ? LIMIT 1;'
    );

    const preview: BankCsvPreviewRow[] = [];

    for (let i = 0; i < parsedRows.length; i++) {
      const raw = parsedRows[i];
      const fingerprint = this.computeFingerprint(
        raw.bookingDate,
        raw.amount,
        raw.bankName,
        raw.bankIban,
        raw.purpose
      );

      if (raw.amount <= 0) {
        preview.push({
          rowIndex: i + 1,
          fingerprint,
          bookingDate: raw.bookingDate,
          bankName: raw.bankName,
          bankIban: raw.bankIban,
          purpose: raw.purpose,
          amount: raw.amount,
          status: 'ignored',
          matchSource: 'none',
          suggestedUser: '',
        });
        continue;
      }

      const existing = checkDuplicateStmt.get(fingerprint) as {invoice_number: string} | undefined;
      if (existing) {
        preview.push({
          rowIndex: i + 1,
          fingerprint,
          bookingDate: raw.bookingDate,
          bankName: raw.bankName,
          bankIban: raw.bankIban,
          purpose: raw.purpose,
          amount: raw.amount,
          status: 'duplicate',
          matchSource: 'none',
          suggestedUser: '',
          existingInvoiceNumber: existing.invoice_number,
        });
        continue;
      }

      const match = this.matchUser(raw.bankName, raw.bankIban, raw.purpose, users, mappings, validUserNames);

      preview.push({
        rowIndex: i + 1,
        fingerprint,
        bookingDate: raw.bookingDate,
        bankName: raw.bankName,
        bankIban: raw.bankIban,
        purpose: raw.purpose,
        amount: raw.amount,
        status: match.user ? 'matched' : 'unmatched',
        matchSource: match.source,
        suggestedUser: match.user,
      });
    }

    return preview;
  }

  private parseBankCsv(csvContent: string): Array<{
    bookingDate: string;
    bankName: string;
    bankIban: string;
    purpose: string;
    amount: number;
  }> {
    const cleaned = csvContent.replace(/^\uFEFF/, '').trim();
    if (!cleaned) {
      return [];
    }

    const delimiter = this.detectDelimiter(cleaned);
    const allLines = this.parseCsvGrid(cleaned, delimiter).filter(
      row => row.some(cell => cell.trim() !== '')
    );

    if (allLines.length < 2) {
      return [];
    }

    // Find header row (banks like Sparkasse/DKB sometimes put metadata lines before the table header)
    let headerIndex = 0;
    for (let i = 0; i < Math.min(allLines.length, 15); i++) {
      const normalizedCells = allLines[i].map(c => this.normalizeHeader(c));
      const hasAmount = normalizedCells.some(c =>
        c.includes('betrag') || c.includes('umsatz') || c === 'amount' || c === 'wert' || c === 'value'
      );
      const hasDateOrPurpose = normalizedCells.some(c =>
        c.includes('buchung') || c.includes('valuta') || c.includes('datum') ||
        c.includes('verwendungszweck') || c.includes('date') || c.includes('purpose')
      );
      if (hasAmount && hasDateOrPurpose) {
        headerIndex = i;
        break;
      }
    }

    const headers = allLines[headerIndex].map(c => this.normalizeHeader(c));

    const dateIdx = this.findColumnIndex(headers, [
      'buchungstag', 'buchungsdatum', 'valutadatum', 'wertstellung', 'datum', 'date', 'bookingdate'
    ]);
    const nameIdx = this.findColumnIndex(headers, [
      'beguenstigterzahlungspflichtiger',
      'namezahlungsbeteiligter',
      'zahlungspflichtiger',
      'auftraggeberempfaenger',
      'auftraggeber',
      'empfaenger',
      'partnername',
      'kontoinhaber',
      'gegenkonto',
      'name',
      'sender',
      'counterparty'
    ]);
    const ibanIdx = this.findColumnIndex(headers, [
      'ibanzahlungsbeteiligter',
      'kontonummeriban',
      'iban',
      'gegenkontoiban',
      'kontonummer',
      'account'
    ]);
    const purposeIdx = this.findColumnIndex(headers, [
      'verwendungszweck',
      'purpose',
      'beschreibung',
      'description',
      'referenz',
      'kundenreferenz',
      'info'
    ]);
    const bookingTextIdx = this.findColumnIndex(headers, ['buchungstext']);
    const amountIdx = this.findColumnIndex(headers, [
      'betragineur', 'betrageur', 'betrag', 'umsatzineur', 'umsatz', 'wert', 'amount', 'value'
    ]);
    const creditDebitIdx = this.findColumnIndex(headers, ['sollhaben', 'sh', 'umsatzart']);

    if (amountIdx === -1) {
      throw new RequestError(400, 'Could not find an amount column (e.g. Betrag / Umsatz) in the CSV');
    }

    const results: Array<{
      bookingDate: string;
      bankName: string;
      bankIban: string;
      purpose: string;
      amount: number;
    }> = [];

    for (let r = headerIndex + 1; r < allLines.length; r++) {
      const row = allLines[r];
      if (row.length <= amountIdx) {
        continue;
      }
      const rawAmount = (row[amountIdx] || '').trim();
      if (!rawAmount) {
        continue;
      }

      let amount = this.parseAmountToCents(rawAmount);
      if (amount === null) {
        continue;
      }

      if (creditDebitIdx !== -1 && row[creditDebitIdx]) {
        const indicator = row[creditDebitIdx].trim().toUpperCase();
        if (indicator === 'S' || indicator === 'SOLL' || indicator === 'DEBIT') {
          amount = -Math.abs(amount);
        } else if (indicator === 'H' || indicator === 'HABEN' || indicator === 'CREDIT') {
          amount = Math.abs(amount);
        }
      }

      const bookingDate = dateIdx !== -1 && row[dateIdx] ? row[dateIdx].trim() : new Date().toISOString().slice(0, 10);
      const bankName = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';
      const bankIban = ibanIdx !== -1 && row[ibanIdx] ? row[ibanIdx].trim() : '';
      let purpose = purposeIdx !== -1 && row[purposeIdx] ? row[purposeIdx].trim() : '';
      if (!purpose && bookingTextIdx !== -1 && row[bookingTextIdx]) {
        purpose = row[bookingTextIdx].trim();
      }

      results.push({
        bookingDate,
        bankName,
        bankIban,
        purpose,
        amount,
      });
    }

    return results;
  }

  private detectDelimiter(content: string): string {
    const sampleLines = content.split(/\r?\n/).slice(0, 10);
    let semicolonCount = 0;
    let commaCount = 0;
    let tabCount = 0;

    for (const line of sampleLines) {
      semicolonCount += (line.match(/;/g) || []).length;
      commaCount += (line.match(/,/g) || []).length;
      tabCount += (line.match(/\t/g) || []).length;
    }

    if (semicolonCount >= commaCount && semicolonCount >= tabCount && semicolonCount > 0) {
      return ';';
    }
    if (tabCount > commaCount && tabCount > semicolonCount) {
      return '\t';
    }
    return ',';
  }

  private parseCsvGrid(content: string, delimiter: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const ch = content[i];
      const next = content[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          currentCell += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          currentCell += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delimiter) {
          currentRow.push(currentCell);
          currentCell = '';
        } else if (ch === '\r' && next === '\n') {
          currentRow.push(currentCell);
          rows.push(currentRow);
          currentRow = [];
          currentCell = '';
          i++;
        } else if (ch === '\n' || ch === '\r') {
          currentRow.push(currentCell);
          rows.push(currentRow);
          currentRow = [];
          currentCell = '';
        } else {
          currentCell += ch;
        }
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell);
      rows.push(currentRow);
    }

    return rows;
  }

  private normalizeHeader(header: string): string {
    return this.normalizeString(header).replace(/[^a-z0-9]/g, '');
  }

  private findColumnIndex(headers: string[], candidates: string[]): number {
    for (const candidate of candidates) {
      const exactIdx = headers.findIndex(h => h === candidate);
      if (exactIdx !== -1) {
        return exactIdx;
      }
    }
    for (const candidate of candidates) {
      const partialIdx = headers.findIndex(h => h.includes(candidate));
      if (partialIdx !== -1) {
        return partialIdx;
      }
    }
    return -1;
  }

  private parseAmountToCents(raw: string): number | null {
    // Strip currency symbols and whitespace
    let cleaned = raw.replace(/[^0-9,.\-+]/g, '').trim();
    if (!cleaned) {
      return null;
    }

    let sign = 1;
    if (cleaned.startsWith('-') || cleaned.endsWith('-')) {
      sign = -1;
    }
    cleaned = cleaned.replace(/[+-]/g, '');

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');

    let normalizedNumber: string;
    if (lastComma > lastDot) {
      // German format: 1.234,56 -> 1234.56
      normalizedNumber = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (lastDot > lastComma) {
      // English format: 1,234.56 -> 1234.56
      normalizedNumber = cleaned.replace(/,/g, '');
    } else {
      normalizedNumber = cleaned;
    }

    const parsed = Number(normalizedNumber);
    if (isNaN(parsed)) {
      return null;
    }
    return sign * Math.round(parsed * 100);
  }

  // ==================== MATCHING LOGIC ====================

  private normalizeString(input: string): string {
    if (!input) {
      return '';
    }
    return input
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private computeFingerprint(
    bookingDate: string,
    amount: number,
    bankName: string,
    bankIban: string,
    purpose: string
  ): string {
    const raw = [
      bookingDate.trim(),
      amount.toString(),
      this.normalizeString(bankName),
      bankIban.replace(/\s+/g, '').toUpperCase(),
      this.normalizeString(purpose),
    ].join('|');

    return crypto.createHash('sha256').update(raw, 'utf8').digest('hex');
  }

  private matchUser(
    bankName: string,
    bankIban: string,
    purpose: string,
    users: User[],
    mappings: Map<string, string>,
    validUserNames: Set<string>
  ): {user: string; source: 'purpose' | 'mapping' | 'fuzzy_name' | 'none'} {
    const normPurpose = this.normalizeString(purpose);
    const normBankName = this.normalizeString(bankName);
    const normIban = bankIban.replace(/\s+/g, '').toUpperCase();

    // 1. Check Purpose for explicit user mention (highest priority)
    if (normPurpose) {
      const fullMatches: string[] = [];
      for (const u of users) {
        const normUser = this.normalizeString(u.name);
        if (!normUser) {
          continue;
        }
        const paddedPurpose = ` ${normPurpose} `;
        if (paddedPurpose.includes(` ${normUser} `)) {
          fullMatches.push(u.name);
        }
      }
      if (fullMatches.length === 1) {
        return {user: fullMatches[0], source: 'purpose'};
      }

      // If no full-name match, check unique single-token match (>= 3 chars) in purpose
      const purposeTokens = new Set(normPurpose.split(' ').filter(t => t.length >= 3));
      const tokenMatches: string[] = [];
      for (const u of users) {
        const userTokens = this.normalizeString(u.name).split(' ').filter(t => t.length >= 3);
        if (userTokens.length > 0 && userTokens.every(t => purposeTokens.has(t))) {
          tokenMatches.push(u.name);
        }
      }
      if (tokenMatches.length === 1) {
        return {user: tokenMatches[0], source: 'purpose'};
      }
    }

    // 2. Check saved BankUserMappings (by IBAN or normalized bankName)
    if (normIban && mappings.has(`IBAN:${normIban}`)) {
      const mappedUser = mappings.get(`IBAN:${normIban}`) || '';
      if (validUserNames.has(mappedUser)) {
        return {user: mappedUser, source: 'mapping'};
      }
    }
    if (normBankName && mappings.has(`NAME:${normBankName}`)) {
      const mappedUser = mappings.get(`NAME:${normBankName}`) || '';
      if (validUserNames.has(mappedUser)) {
        return {user: mappedUser, source: 'mapping'};
      }
    }

    // 3. Fuzzy / Token match on bankName
    if (normBankName) {
      // Handle "Lastname, Firstname" reversal
      let reversedBankName = normBankName;
      if (bankName.includes(',')) {
        const parts = bankName.split(',').map(p => this.normalizeString(p)).filter(Boolean);
        if (parts.length === 2) {
          reversedBankName = `${parts[1]} ${parts[0]}`;
        }
      }

      const bankTokens = new Set(normBankName.split(' ').filter(Boolean));
      const candidates: Array<{name: string; score: number}> = [];

      for (const u of users) {
        const normUser = this.normalizeString(u.name);
        if (!normUser) {
          continue;
        }
        if (normUser === normBankName || normUser === reversedBankName) {
          candidates.push({name: u.name, score: 100});
          continue;
        }

        const userTokens = normUser.split(' ').filter(Boolean);
        if (userTokens.length > 0 && userTokens.every(t => bankTokens.has(t))) {
          candidates.push({name: u.name, score: 80});
        } else if (bankTokens.size > 0 && Array.from(bankTokens).every(t => userTokens.includes(t))) {
          candidates.push({name: u.name, score: 75});
        }
      }

      candidates.sort((a, b) => b.score - a.score);
      if (candidates.length === 1 || (candidates.length > 1 && candidates[0].score > candidates[1].score)) {
        return {user: candidates[0].name, source: 'fuzzy_name'};
      }
    }

    return {user: '', source: 'none'};
  }

  // ==================== CONFIRM IMPORT & GENERATE PDF ====================

  confirmImport(items: BankImportConfirmItem[], currencySymbol: string = '€'): BankImportRecord[] {
    if (!Array.isArray(items) || items.length === 0) {
      throw new RequestError(400, 'No items provided for import');
    }

    const getUserStmt = this.dbService.prepare('SELECT name, balance FROM Users WHERE name = ?;');
    const updateBalanceStmt = this.dbService.prepare('UPDATE Users SET balance = balance + ? WHERE name = ?;');
    const insertHistoryStmt = this.dbService.prepare(
      'INSERT INTO History(id, user, reason, amount) VALUES (?, ?, ?, ?);'
    );
    const checkDuplicateStmt = this.dbService.prepare(
      'SELECT id FROM BankImports WHERE fingerprint = ? LIMIT 1;'
    );
    const insertBankImportStmt = this.dbService.prepare(
      'INSERT INTO BankImports(' +
      '  id, fingerprint, invoice_number, history_id, user, booking_date, ' +
      '  bank_name, bank_iban, purpose, amount, old_balance, new_balance, pdf_path' +
      ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    );
    const upsertMappingStmt = this.dbService.prepare(
      'INSERT INTO BankUserMappings(bank_identifier, user, updated_at) VALUES (?, ?, DATETIME(\'now\', \'localtime\')) ' +
      'ON CONFLICT(bank_identifier) DO UPDATE SET user = excluded.user, updated_at = DATETIME(\'now\', \'localtime\');'
    );
    const getSettingsStmt = this.dbService.prepare(
      'SELECT prefix, padding, next_counter FROM InvoiceSettings WHERE id = 1;'
    );
    const updateCounterStmt = this.dbService.prepare(
      'UPDATE InvoiceSettings SET next_counter = ? WHERE id = 1;'
    );
    const getRecordStmt = this.dbService.prepare(
      'SELECT * FROM BankImports WHERE id = ?;'
    );

    const createdRecords: BankImportRecord[] = this.dbService.transaction(() => {
      const settings = (getSettingsStmt.get() as InvoiceSettings) || {
        prefix: 'RE-',
        padding: 4,
        next_counter: 1,
      };
      let counter = settings.next_counter;
      const records: BankImportRecord[] = [];

      for (const item of items) {
        const amount = Math.round(Number(item.amount) || 0);
        if (amount <= 0 || !item.user) {
          continue;
        }

        const fingerprint = item.fingerprint || this.computeFingerprint(
          item.bookingDate || '',
          amount,
          item.bankName || '',
          item.bankIban || '',
          item.purpose || ''
        );

        // Skip if already imported
        if (checkDuplicateStmt.get(fingerprint)) {
          continue;
        }

        const user = getUserStmt.get(item.user) as User | undefined;
        if (!user) {
          throw new RequestError(404, `User "${item.user}" not found`);
        }

        const invoiceNumber = `${settings.prefix}${String(counter).padStart(settings.padding, '0')}`;
        counter++;

        const oldBalance = user.balance;
        const newBalance = oldBalance + amount;
        const historyId = v4();
        const importId = v4();
        const reason = `Bank-Import ${invoiceNumber}`;

        const safeFileName = this.sanitizeFileName(invoiceNumber) + '.pdf';
        const pdfRelativePath = path.join('data', 'invoices', safeFileName);

        insertHistoryStmt.run(historyId, user.name, reason, amount);
        updateBalanceStmt.run(amount, user.name);
        insertBankImportStmt.run(
          importId,
          fingerprint,
          invoiceNumber,
          historyId,
          user.name,
          item.bookingDate || new Date().toISOString().slice(0, 10),
          item.bankName || '',
          item.bankIban || '',
          item.purpose || '',
          amount,
          oldBalance,
          newBalance,
          pdfRelativePath
        );

        if (item.rememberMapping !== false) {
          const normIban = (item.bankIban || '').replace(/\s+/g, '').toUpperCase();
          const normBankName = this.normalizeString(item.bankName || '');
          if (normIban) {
            upsertMappingStmt.run(`IBAN:${normIban}`, user.name);
          }
          if (normBankName) {
            upsertMappingStmt.run(`NAME:${normBankName}`, user.name);
          }
        }

        const record = getRecordStmt.get(importId) as BankImportRecord;
        records.push(record);
      }

      updateCounterStmt.run(counter);
      return records;
    });

    // Compile and save individual PDFs for all created records
    for (const record of createdRecords) {
      this.compileAndSaveInvoicePdf(record, currencySymbol);
    }

    return createdRecords;
  }

  getImportHistory(limit: number = 500): BankImportRecord[] {
    const sql = this.dbService.prepare(
      'SELECT * FROM BankImports ORDER BY created_at DESC, invoice_number DESC LIMIT ?;'
    );
    return sql.all(limit) as BankImportRecord[];
  }

  getImportById(id: string): BankImportRecord {
    const sql = this.dbService.prepare('SELECT * FROM BankImports WHERE id = ? LIMIT 1;');
    const record = sql.get(id) as BankImportRecord | undefined;
    if (!record) {
      throw new RequestError(404, 'Invoice record not found');
    }
    return record;
  }

  // ==================== LATEX & PDF COMPILATION ====================

  getOrCreateInvoicePdf(id: string, currencySymbol: string = '€', forceRecompile: boolean = false): {
    buffer: Buffer;
    fileName: string;
  } {
    const record = this.getImportById(id);
    const fallbackRelPath = path.join('data', 'invoices', `${this.sanitizeFileName(record.invoice_number)}.pdf`);
    const fullPdfPath = path.join(this.rootDir, record.pdf_path || fallbackRelPath);

    if (!forceRecompile && fs.existsSync(fullPdfPath)) {
      return {
        buffer: fs.readFileSync(fullPdfPath),
        fileName: `${this.sanitizeFileName(record.invoice_number)}.pdf`,
      };
    }

    const buffer = this.compileAndSaveInvoicePdf(record, currencySymbol);
    return {
      buffer,
      fileName: `${this.sanitizeFileName(record.invoice_number)}.pdf`,
    };
  }

  compileBatchPdf(ids: string[], currencySymbol: string = '€'): {
    buffer: Buffer;
    fileName: string;
  } {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new RequestError(400, 'No invoice IDs specified');
    }

    const records = ids.map(id => this.getImportById(id));
    const template = this.getTemplate();

    const beginTag = '\\begin{document}';
    const endTag = '\\end{document}';
    const beginIdx = template.indexOf(beginTag);
    const endIdx = template.lastIndexOf(endTag);

    let combinedTex: string;
    if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
      const preamble = template.slice(0, beginIdx + beginTag.length);
      const bodyTemplate = template.slice(beginIdx + beginTag.length, endIdx);
      const renderedBodies = records.map(rec => this.fillTemplatePlaceholders(bodyTemplate, rec, currencySymbol));
      combinedTex = `${preamble}\n${renderedBodies.join('\n\\newpage\n')}\n${endTag}\n`;
    } else {
      // Fallback if template doesn't have standard document tags
      combinedTex = this.fillTemplatePlaceholders(template, records[0], currencySymbol);
    }

    const buffer = this.runPdflatex(combinedTex);
    const batchFileName = `invoices-batch-${Date.now()}.pdf`;
    const savedBatchPath = path.join(this.invoicesDir, batchFileName);
    fs.writeFileSync(savedBatchPath, buffer);

    return {
      buffer,
      fileName: batchFileName,
    };
  }

  compileSamplePdf(customTemplate?: string, currencySymbol: string = '€'): Buffer {
    const settings = this.getSettings();
    const sampleInvoiceNumber = `${settings.prefix}${String(settings.next_counter).padStart(settings.padding, '0')}`;
    const sampleRecord: BankImportRecord = {
      id: 'sample',
      fingerprint: 'sample',
      invoice_number: sampleInvoiceNumber,
      history_id: 'sample',
      user: 'Max Mustermann',
      booking_date: new Date().toLocaleDateString('de-DE'),
      bank_name: 'Mustermann, Max',
      bank_iban: 'DE89 3704 0044 0532 0130 00',
      purpose: 'Getraenkekasse Aufladung Max Mustermann',
      amount: 2500,
      old_balance: -550,
      new_balance: 1950,
      pdf_path: '',
      created_at: new Date().toISOString(),
    };

    const template = customTemplate !== undefined ? customTemplate : this.getTemplate();
    const renderedTex = this.fillTemplatePlaceholders(template, sampleRecord, currencySymbol);
    return this.runPdflatex(renderedTex);
  }

  private compileAndSaveInvoicePdf(record: BankImportRecord, currencySymbol: string = '€'): Buffer {
    this.ensureDirectoriesAndFiles();
    const template = this.getTemplate();
    const renderedTex = this.fillTemplatePlaceholders(template, record, currencySymbol);
    const pdfBuffer = this.runPdflatex(renderedTex);

    const safeBase = this.sanitizeFileName(record.invoice_number);
    const fullPdfPath = path.join(this.invoicesDir, `${safeBase}.pdf`);
    const fullTexPath = path.join(this.invoicesDir, `${safeBase}.tex`);

    fs.writeFileSync(fullTexPath, renderedTex, 'utf8');
    fs.writeFileSync(fullPdfPath, pdfBuffer);

    return pdfBuffer;
  }

  private fillTemplatePlaceholders(
    template: string,
    record: BankImportRecord,
    currencySymbol: string
  ): string {
    const invoiceDate = record.created_at
      ? new Date(record.created_at).toLocaleDateString('de-DE')
      : new Date().toLocaleDateString('de-DE');

    const replacements: Record<string, string> = {
      '{{INVOICE_NUMBER}}': this.escapeLatex(record.invoice_number),
      '{{INVOICE_DATE}}': this.escapeLatex(invoiceDate),
      '{{BOOKING_DATE}}': this.escapeLatex(record.booking_date || invoiceDate),
      '{{USER_NAME}}': this.escapeLatex(record.user),
      '{{BANK_NAME}}': this.escapeLatex(record.bank_name || record.user),
      '{{BANK_IBAN}}': this.escapeLatex(record.bank_iban || '-'),
      '{{PURPOSE}}': this.escapeLatex(record.purpose || '-'),
      '{{AMOUNT}}': this.escapeLatex(this.formatCentsDe(record.amount)),
      '{{OLD_BALANCE}}': this.escapeLatex(this.formatCentsDe(record.old_balance)),
      '{{NEW_BALANCE}}': this.escapeLatex(this.formatCentsDe(record.new_balance)),
      '{{CURRENCY}}': this.escapeLatexCurrency(currencySymbol),
    };

    let output = template;
    for (const [placeholder, value] of Object.entries(replacements)) {
      output = output.split(placeholder).join(value);
    }
    return output;
  }

  private formatCentsDe(cents: number): string {
    const euros = (cents / 100).toFixed(2);
    return euros.replace('.', ',');
  }

  private escapeLatexCurrency(currencySymbol: string): string {
    const trimmed = (currencySymbol || '€').trim();
    if (trimmed === '€') {
      return 'EUR';
    }
    return this.escapeLatex(trimmed);
  }

  private escapeLatex(input: string): string {
    if (!input) {
      return '';
    }
    const map: Record<string, string> = {
      '\\': '\\textbackslash{}',
      '&': '\\&',
      '%': '\\%',
      '$': '\\$',
      '#': '\\#',
      '_': '\\_',
      '{': '\\{',
      '}': '\\}',
      '~': '\\textasciitilde{}',
      '^': '\\textasciicircum{}',
      'ä': '\\"{a}',
      'ö': '\\"{o}',
      'ü': '\\"{u}',
      'Ä': '\\"{A}',
      'Ö': '\\"{O}',
      'Ü': '\\"{U}',
      'ß': '{\\ss}',
    };
    return input.replace(/[\\&%$#_{}~^äöüÄÖÜß]/g, ch => map[ch] || ch);
  }

  private sanitizeFileName(name: string): string {
    return (name || 'invoice').replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private resolvePdflatexBinary(): string {
    const candidates = [
      'pdflatex',
      '/Library/TeX/texbin/pdflatex',
      '/usr/bin/pdflatex',
      '/usr/local/bin/pdflatex',
    ];
    for (const bin of candidates) {
      if (bin.startsWith('/')) {
        if (fs.existsSync(bin)) {
          return bin;
        }
      } else {
        try {
          execFileSync('which', [bin], {stdio: 'ignore'});
          return bin;
        } catch {
          // continue
        }
      }
    }
    return 'pdflatex';
  }

  private runPdflatex(texContent: string): Buffer {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drinklist-latex-'));
    const texFile = path.join(tmpDir, 'invoice.tex');
    const pdfFile = path.join(tmpDir, 'invoice.pdf');
    const logFile = path.join(tmpDir, 'invoice.log');

    try {
      fs.writeFileSync(texFile, texContent, 'utf8');
      const pdflatexBin = this.resolvePdflatexBinary();

      execFileSync(
        pdflatexBin,
        ['-interaction=nonstopmode', '-halt-on-error', '-no-shell-escape', 'invoice.tex'],
        {
          cwd: tmpDir,
          stdio: 'pipe',
          timeout: 30000,
        }
      );

      if (!fs.existsSync(pdfFile)) {
        throw new RequestError(500, 'pdflatex did not produce a PDF file');
      }

      return fs.readFileSync(pdfFile);
    } catch (err: any) {
      let logExcerpt = '';
      if (fs.existsSync(logFile)) {
        const logContent = fs.readFileSync(logFile, 'utf8');
        const errorLines = logContent
          .split('\n')
          .filter(line => line.startsWith('!') || line.includes('Error') || line.includes('l.'))
          .slice(0, 6)
          .join(' | ');
        logExcerpt = errorLines ? `: ${errorLines}` : '';
      }
      throw new RequestError(400, `LaTeX PDF compilation failed${logExcerpt}`);
    } finally {
      try {
        fs.rmdirSync(tmpDir, {recursive: true});
      } catch {
        // ignore cleanup error
      }
    }
  }
}

export default BankImportService;
