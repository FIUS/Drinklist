import {DbService} from '../../services/api/db.service';
import {Beverage} from '../../models/api/beverage';
import {User} from '../../models/api/user';

export class StatsService {
  constructor(
    private dbService: DbService,
  ) {
  }

  async getOrderCount(): Promise<number> {
    const sql = await this.dbService.prepare('SELECT COUNT(*) AS count FROM cash_transactions;');
    return sql.get<{ count: number }>()
      .then(result => result ? result.count : -1)
      .finally(() => sql.reset());
  }

  async getUserCount(): Promise<number> {
    const sql = await this.dbService.prepare('SELECT COUNT(*) AS count FROM Users;');
    return sql.get<{ count: number }>()
      .then(result => result ? result.count : -1)
      .finally(() => sql.reset());
  }

  async getBeverageCount(): Promise<number> {
    const sql = await this.dbService.prepare('SELECT COUNT(*) AS count FROM Beverages;');
    return sql.get<{ count: number }>()
      .then(result => result ? result.count : -1)
      .finally(() => sql.reset());
  }

  async getTopBeverages(): Promise<(Beverage & { count: number })[]> {
    const sql = await this.dbService.prepare('SELECT * FROM topBeverages');
    return sql.all();
  }

  async getTopSavers(): Promise<User[]> {
    const sql = await this.dbService.prepare('SELECT * FROM users ORDER BY balance DESC LIMIT 5;');
    return sql.all();
  }

  async getTopDebtors(): Promise<User[]> {
    const sql = await this.dbService.prepare('SELECT * FROM users ORDER BY balance ASC LIMIT 5;');
    return sql.all();
  }
}
