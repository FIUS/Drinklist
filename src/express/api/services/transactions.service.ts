import {DbService} from '../../services/api/db.service';
import {CashTransaction} from '../../models/api/cash-transaction';
import {Beverage} from '../../models/api/beverage';
import {RequestError} from '../api.util';
import {User} from '../../models/api/user';

type TxnType = 'cash' | 'beverages';

export class TransactionsService {
  constructor(
    private dbService: DbService,
  ) {
  }

  async getTransactions(offset: number, limit: number, txnType: TxnType): Promise<CashTransaction[]> {
    let sql;
    switch (txnType) {
      case 'cash':
        sql = await this.dbService.prepare('SELECT * FROM cash_transactions WHERE ROWID > ? LIMIT ?');
        break;
      case 'beverages':
        sql = await this.dbService.prepare('SELECT * FROM beverage_transactions WHERE ROWID > ? LIMIT ?');
        break;
    }
    return sql.all(offset, limit);
  }

  async orderBeverage(beverageId: number, userId: number): Promise<void> {
    const getBeverage = await this.dbService.prepare('SELECT * FROM beverages WHERE id = ? AND deleted = 0');
    const getUser = await this.dbService.prepare('SELECT * FROM users WHERE id = ?');
    const insertStmt = await this.dbService.prepare(`INSERT INTO beverage_transactions (user, beverage, units, money, timestamp)
                                                     VALUES ($user, $beverage, 1, $money, $timestamp)`);

    const beverage = await getBeverage.get<Beverage>(beverageId).finally(() => getBeverage.reset());
    if (beverage === undefined) {
      throw new RequestError(404, 'Beverage not found');
    }

    const user = await getUser.get<User>(userId).finally(() => getUser.reset());
    if (user === undefined) {
      throw new RequestError(404, 'User not found');
    }

    await insertStmt.run({
      $user: userId,
      $beverage: beverage.id,
      $money: beverage.price,
      $timestamp: new Date().getTime()
    });
  }

  async getUserTransactions(user: number, txnType: TxnType): Promise<CashTransaction[]> {
    let sql;
    switch (txnType) {
      case 'cash':
        sql = await this.dbService.prepare('SELECT * FROM cash_transactions WHERE user_from = $user OR user_to = $user');
        break;
      case 'beverages':
        sql = await this.dbService.prepare('SELECT * FROM beverage_transactions WHERE user = $user');
        break;
    }
    return sql.all({$user: user});
  }

  async isRecent(id: number, txnType: TxnType): Promise<boolean> {
    let sql;
    switch (txnType) {
      case 'cash':
        sql = await this.dbService.prepare('SELECT timestamp FROM cash_transactions WHERE id = ?');
        break;
      case 'beverages':
        sql = await this.dbService.prepare('SELECT timestamp FROM beverage_transactions WHERE id = ?');
        break;
    }

    const timestamp: number = await sql.get<{ timestamp: number }>(id).then(result => result?.timestamp || 0);
    return timestamp > new Date().getTime() - (30 * 1000);
  }

  async deleteCashTransaction(id: number): Promise<void> {
    const sql = await this.dbService.prepare('DELETE FROM cash_transactions WHERE id = ?');
    await sql.run(id);
  }

  async revertCashTransaction(id: number): Promise<void> {
    const sql = await this.dbService.prepare('UPDATE cash_transactions SET reverted = 1 WHERE id = ?');
    await sql.run(id);
  }

  async undoBeverageTransaction(id: number): Promise<void> {
    const sql = await this.dbService.prepare('DELETE FROM beverage_transactions WHERE id = ?');
    await sql.run(id);
  }
}
