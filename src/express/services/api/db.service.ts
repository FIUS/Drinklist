import IService from '../service.interface';
import {Database, Statement} from 'better-sqlite3';

const DatabaseConstructor = require('better-sqlite3');

class DbService implements IService {
  private readonly db: Database;
  private readonly statements: Map<string, Statement> = new Map<string, Statement>();

  constructor(fileName: string) {
    this.db = DatabaseConstructor(fileName, {fileMustExist: true});
    this.initBankImportTables();
  }

  private initBankImportTables(): void {
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS BankImports (' +
      '  id VARCHAR(255) PRIMARY KEY,' +
      '  fingerprint VARCHAR(255) NOT NULL UNIQUE,' +
      '  invoice_number VARCHAR(255) NOT NULL,' +
      '  history_id VARCHAR(255) NOT NULL,' +
      '  user VARCHAR(255) NOT NULL,' +
      '  booking_date VARCHAR(255) NOT NULL,' +
      '  bank_name VARCHAR(255) NOT NULL DEFAULT \'\',' +
      '  bank_iban VARCHAR(255) NOT NULL DEFAULT \'\',' +
      '  purpose TEXT NOT NULL DEFAULT \'\',' +
      '  amount INTEGER NOT NULL DEFAULT 0,' +
      '  old_balance INTEGER NOT NULL DEFAULT 0,' +
      '  new_balance INTEGER NOT NULL DEFAULT 0,' +
      '  pdf_path VARCHAR(512) NOT NULL DEFAULT \'\',' +
      '  created_at DATETIME NOT NULL DEFAULT (DATETIME(\'now\', \'localtime\'))' +
      ');' +
      'CREATE TABLE IF NOT EXISTS BankUserMappings (' +
      '  bank_identifier VARCHAR(255) PRIMARY KEY,' +
      '  user VARCHAR(255) NOT NULL,' +
      '  updated_at DATETIME NOT NULL DEFAULT (DATETIME(\'now\', \'localtime\'))' +
      ');' +
      'CREATE TABLE IF NOT EXISTS InvoiceSettings (' +
      '  id INTEGER PRIMARY KEY CHECK (id = 1),' +
      '  prefix VARCHAR(255) NOT NULL DEFAULT \'RE-\',' +
      '  padding INTEGER NOT NULL DEFAULT 4,' +
      '  next_counter INTEGER NOT NULL DEFAULT 1' +
      ');' +
      'INSERT OR IGNORE INTO InvoiceSettings (id, prefix, padding, next_counter) VALUES (1, \'RE-\', 4, 1);'
    );
  }

  transaction<T>(fn: () => T): T {
    const trx = this.db.transaction(fn);
    return trx();
  }

  async shutdown(): Promise<void> {
    this.db.close();
    return;
  }

  prepare(sql: string): Statement {
    if (this.statements.has(sql)) {
      return this.statements.get(sql) as Statement;
    }
    const statement = this.db.prepare(sql);
    this.statements.set(sql, statement);
    return statement;
  }
}

export default DbService;
