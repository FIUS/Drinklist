import IService from '../service.interface';
import {Database, Statement} from 'better-sqlite3';

const DatabaseConstructor = require('better-sqlite3');

class DbService implements IService {
  private readonly db: Database;
  private readonly statements: Map<string, Statement> = new Map<string, Statement>();

  constructor(fileName: string) {
    this.db = DatabaseConstructor(fileName, {fileMustExist: true});
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
