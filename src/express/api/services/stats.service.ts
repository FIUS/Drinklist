import DbService from '../../services/api/db.service';
import Beverage from '../../models/api/beverage';
import User from '../../models/api/user';

class StatsService {
  constructor(
    private dbService: DbService,
  ) {
  }

  getOrderCount(): number {
    const sql = this.dbService.prepare('SELECT COUNT(*) FROM History;');
    return sql.get()['COUNT(*)'];
  }

  getUserCount(): number {
    const sql = this.dbService.prepare('SELECT COUNT(*) FROM Users;');
    return sql.get()['COUNT(*)'];
  }

  getBeverageCount(): number {
    const sql = this.dbService.prepare('SELECT COUNT(*) FROM Beverages;');
    return sql.get()['COUNT(*)'];
  }

  getTopBeverages(): Beverage[] {
    const sql = this.dbService.prepare('SELECT b.name, b.stock, b.price FROM (SELECT beverage, COUNT(beverage) AS count FROM History WHERE beverage != \'\' GROUP BY beverage ORDER BY count DESC) t INNER JOIN Beverages b ON t.beverage = b.name LIMIT 5;');
    return sql.all();
  }

  getTopSavers(): User[] {
    const sql = this.dbService.prepare('SELECT name, balance, hidden FROM Users ORDER BY balance DESC LIMIT 5;');
    return sql.all();
  }

  getTopDebtors(): User[] {
    const sql = this.dbService.prepare('SELECT name, balance, hidden FROM Users ORDER BY balance ASC LIMIT 5;');
    return sql.all();
  }
}

export default StatsService;
