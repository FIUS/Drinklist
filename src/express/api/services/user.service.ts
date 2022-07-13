import DbService from '../../services/api/db.service';
import User from '../../models/api/user';
import {Statement} from 'better-sqlite3';
import {v4} from 'uuid';

class UserService {
  constructor(
    private dbService: DbService
  ) {
  }

  getUsers(admin: boolean = false): User[] | string[] {
    let sql: Statement;
    if (admin) {
      sql = this.dbService.prepare('SELECT name, balance, hidden FROM Users ORDER BY name;');
      return sql.all();
    } else {
      sql = this.dbService.prepare('SELECT name FROM Users WHERE hidden = 0 ORDER BY name;');
      return sql.all().map(value => {
        return (value as User).name;
      });
    }
  }

  getUser(name: string): User {
    const sql = this.dbService.prepare('SELECT name, balance FROM Users WHERE name = ?;');
    return sql.get(name);
  }

  createUser(name: string): void {
    const sql = this.dbService.prepare('INSERT INTO Users (name) VALUES (?);');
    sql.run(name);
  }

  setVisibility(hidden: boolean, name: string): void {
    const sql = this.dbService.prepare('UPDATE Users SET hidden = ? WHERE name = ?;');
    sql.run(+hidden, name);
  }

  updateBalance(name: string, reason: string, amount: number): void {
    const addHistoryEntry = this.dbService.prepare('INSERT INTO History(id, user, reason, amount) VALUES (?, ?, ?, ?);');
    const updateBalance = this.dbService.prepare('UPDATE Users SET balance = balance + ? WHERE name = ?;');

    addHistoryEntry.run(v4(), name, reason, amount);
    updateBalance.run(amount, name);
  }

  deleteUser(name: string): void {
    const sql = this.dbService.prepare('DELETE FROM Users WHERE name = ?;');
    sql.run(name);
  }
}

export default UserService;
