import {IService} from '../service.interface';
import {Database as DatabaseDriver, Statement as DBStatement} from 'sqlite3';
import {Database, ISqlite, open, Statement} from 'sqlite';
import * as path from 'path';

function snakeToCamel<T extends object>(o: T): T {
  if (o === undefined) {
    return o;
  }
  const keys = Object.keys(o) as (keyof T)[];
  const r = {} as T;
  for (const key of keys) {
    if (!o.hasOwnProperty(key)) {
      continue;
    }
    const k = (key as string).replace(/(?!^)_./g, p1 => p1.replace('_', '').toUpperCase()) as keyof T;
    r[k] = o[key];
  }
  return r;
}

class CCStatement<S extends DBStatement = DBStatement> extends Statement {
  constructor(stmt: S) {
    super(stmt);
  }

  async get<T = any>(...params: any[]): Promise<T | undefined> {
    const result = await super.get(...params);
    return snakeToCamel(result);
  }

  async all<T = any[]>(...params: any[]): Promise<T> {
    const result = await super.all<T>(...params);
    // @ts-ignore
    return result.map(value => snakeToCamel(value));
  }
}

export class DbService implements IService {
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
    let statement = await this.db.prepare(sql);
    statement = new CCStatement(statement.getStatementInstance());
    this.statements.set(sql, statement);
    return statement;
  }

  async run(sql: ISqlite.SqlType): Promise<void> {
    await this.db.run(sql);
  }
}
