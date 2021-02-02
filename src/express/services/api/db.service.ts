import {Database, Statement} from 'sqlite3';
import IService from '../service.interface';

class DbService implements IService {
  private readonly db: Database;

  constructor(fileName: string) {
    this.db = new Database(fileName, err => {
      if (err) {
        throw err;
      }
    });
  }

  shutdown(): Promise<void> {
    return new Promise<void>(resolve => {
      this.db.close(() => {
        resolve();
      });
    });
  }

  prepare(sql: string): Statement {
    return this.db.prepare(sql);
  }
}

export default DbService;
