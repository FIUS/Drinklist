import IService from '../service.interface';
import {Database as OldDatabase, Statement as OldStatement} from 'better-sqlite3';
import {Database as DatabaseDriver} from 'sqlite3';
import {Database, ISqlite, open, Statement} from 'sqlite';
import * as path from 'path';

const DatabaseConstructor = require('better-sqlite3');

class DbService implements IService {
  private readonly db: Database;
  private readonly statements: Map<string, Statement> = new Map<string, Statement>();

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

  private constructor(db: Database) {
    this.db = db;
  }

  async shutdown(): Promise<void> {
    this.statements.forEach(statement => statement.finalize());
    await this.db.close();
    return;
  }

  async prepare(sql: string): Promise<Statement> {
    if (this.statements.has(sql)) {
      return this.statements.get(sql) as Statement;
    }
    const statement = await this.db.prepare(sql);
    this.statements.set(sql, statement);
    return statement;
  }

  async run(sql: ISqlite.SqlType): Promise<void> {
    await this.db.run(sql);
  }
}

export class LegacyDbService implements IService {
  private readonly db: OldDatabase;
  private readonly statements: Map<string, OldStatement> = new Map<string, OldStatement>();

  constructor(fileName: string) {
    this.db = DatabaseConstructor(fileName, {fileMustExist: true});
  }

  async shutdown(): Promise<void> {
    this.db.close();
    return;
  }

  prepare(sql: string): OldStatement {
    if (this.statements.has(sql)) {
      return this.statements.get(sql) as OldStatement;
    }
    const statement = this.db.prepare(sql);
    this.statements.set(sql, statement);
    return statement;
  }
}

export default DbService;
