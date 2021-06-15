import LegacyDbService from '../../services/api/db.service';
import {RequestError} from '../api.util';
import Beverage from '../../models/api/beverage';
import {v4} from 'uuid';
import Order from '../../models/api/order';
import {Statement} from 'better-sqlite3';

class OrdersService {
  constructor(
    private dbService: LegacyDbService,
  ) {
  }

  newOrder(user: string, beverageName: string): void {
    const getBeverage = this.dbService.prepare('SELECT price, stock FROM Beverages WHERE name = ?;');
    const updateStock = this.dbService.prepare('UPDATE Beverages SET stock = stock-1 WHERE name = ?;');
    const updateBalance = this.dbService.prepare('UPDATE Users SET balance = balance - ? WHERE name = ?;');
    const addHistory = this.dbService.prepare('INSERT INTO History(id, user, reason, amount, beverage, beverage_count) VALUES (?, ?, ?, ?, ?, ?);');

    const beverage = getBeverage.get(beverageName) as Beverage;
    if (beverage === undefined) {
      throw new RequestError(404, 'Beverage not found');
    }

    updateStock.run(beverageName);
    updateBalance.run(beverage.price, user);
    addHistory.run(v4(), user, beverageName, -beverage.price, beverageName, 1);
  }

  getLatestOrders(): Order[] {
    const sql = this.dbService.prepare('SELECT id, user, reason, amount, beverage, beverage_count, timestamp FROM History ORDER BY timestamp DESC LIMIT 100;');

    const latestOrders: Order[] = [];

    const transactions = sql.all() as Order[];
    for (const transaction of transactions) {
      let reverted = false;

      // Check if a later transaction reverted this transaction
      for (const index in latestOrders) {
        if (latestOrders[+index].reason === transaction.id) {
          latestOrders.splice(+index, 1);
          reverted = true;
        }
      }

      // If transaction is not reverted and is a beverage order, add it to result array
      if (!reverted &&
        transaction.user !== undefined && transaction.user !== null && transaction.user !== '' &&
        transaction.beverage !== undefined && transaction.beverage !== null && transaction.beverage !== '') {
        latestOrders.push(transaction);
      }
    }

    return latestOrders;
  }

  getHistory(limit: number): Order[] {
    const sql = this.dbService.prepare('SELECT id, user, reason, amount, beverage, beverage_count, timestamp FROM History ORDER BY timestamp DESC LIMIT ?;');
    return sql.all(limit);
  }

  getUserHistory(user: string): Order[] {
    const sql = this.dbService.prepare('SELECT id, user, reason, amount, beverage, beverage_count, timestamp FROM History WHERE user = ? ORDER BY timestamp DESC LIMIT 1000;');

    const userHistory: Order[] = [];

    const userTransactions = sql.all(user);
    for (const transaction of userTransactions) {
      let reverted = false;

      // Check if a later (i.e. newer) transaction reverted this transaction
      for (const index in userHistory) {
        if (userHistory[+index].reason === transaction.id) {
          userHistory.splice(+index, 1);
          reverted = true;
        }
      }

      // If transaction is not reverted, add it to result array
      if (!reverted) {
        userHistory.push(transaction);
      }
    }

    return userHistory;
  }

  getOrder(id: string, addFreshFlag?: boolean): Order {
    let sql: Statement;

    // Why is there a LIMIT 1? Isn't the ID supposed to be unique???
    if (addFreshFlag) {
      sql = this.dbService.prepare('SELECT timestamp > (DATETIME(\'now\', \'-30 seconds\', \'localtime\')) as fresh, id, user, amount, beverage, beverage_count, timestamp FROM History WHERE id = ? LIMIT 1;');
    } else {
      sql = this.dbService.prepare('SELECT id, user, amount, beverage, beverage_count, timestamp FROM History WHERE id = ? LIMIT 1;');
    }

    return sql.get(id);
  }

  deleteOrder(order: Order): void {
    const updateUser = this.dbService.prepare('UPDATE Users SET balance = balance - ? WHERE name = ?;');
    const updateBeverage = this.dbService.prepare('UPDATE Beverages SET stock = stock + ? WHERE name = ?');
    const deleteOrder = this.dbService.prepare('DELETE FROM History WHERE id = ?;');

    if (order.amount !== 0 && order.user !== '') {
      updateUser.run(order.amount, order.user);
    }
    if (order.beverage !== '') {
      updateBeverage.run(order.beverage_count, order.beverage);
    }
    deleteOrder.run(order.id);
  }

  revertOrder(order: Order): void {
    const checkReversion = this.dbService.prepare('SELECT * FROM History WHERE reason = ? LIMIT 1;');

    if (checkReversion.get(order.id) !== undefined) { // A reversion transaction already exists
      throw new RequestError(409, 'Order already reverted'); // 409 Conflict
    }

    const updateUser = this.dbService.prepare('UPDATE Users SET balance = balance - ? WHERE name = ?;');
    const updateBeverage = this.dbService.prepare('UPDATE Beverages SET stock = stock + ? WHERE name = ?');
    const createReversion = this.dbService.prepare('INSERT INTO History(id, user, reason, amount, beverage, beverage_count) VALUES (?, ?, ?, ?, ?, ?);');

    if (order.amount !== 0 && order.user !== '') {
      updateUser.run(order.amount, order.user);
    }
    if (order.beverage !== '') {
      updateBeverage.run(order.beverage_count, order.beverage);
    }
    createReversion.run(v4(), order.user, order.id, -order.amount, order.beverage, order.beverage_count);
  }
}

export default OrdersService;
