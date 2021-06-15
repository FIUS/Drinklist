import IService from '../service.interface';
import {Database, Statement} from 'better-sqlite3';
import {Database as DatabaseDriver} from 'sqlite3';
import {Database as Database2, ISqlite, open, Statement as Statement2} from 'sqlite';
import * as path from 'path';

const DatabaseConstructor = require('better-sqlite3');

export class DbService implements IService {
  private readonly db: Database2;
  private readonly statements: Map<string, Statement2> = new Map<string, Statement2>();

  static async create(filename: string): Promise<DbService> {
    const db = await open({
      filename,
      driver: DatabaseDriver
    });
    await db.migrate({
      migrationsPath: path.join(process.cwd(), 'sql')
    });
    return new DbService(db);
  }

  private constructor(db: Database2) {
    this.db = db;
  }

  async shutdown(): Promise<void> {
    this.statements.forEach(statement => statement.finalize());
    await this.db.close();
    return;
  }

  async prepare(sql: string): Promise<Statement2> {
    if (this.statements.has(sql)) {
      return this.statements.get(sql) as Statement2;
    }
    const statement = await this.db.prepare(sql);
    this.statements.set(sql, statement);
    return statement;
  }

  async run(sql: ISqlite.SqlType): Promise<void> {
    await this.db.run(sql);
  }
}

class LegacyDbService implements IService {
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

export default LegacyDbService;
