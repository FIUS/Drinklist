import {DbService} from '../../services/api/db.service';
import {User} from '../../models/api/user';

export class UserService {
  constructor(
    private dbService: DbService
  ) {
  }

  async getUsers(includeHidden: boolean): Promise<User[]> {
    let sql;
    if (includeHidden) {
      sql = await this.dbService.prepare('SELECT * FROM users WHERE deleted = 0;');
    } else {
      sql = await this.dbService.prepare('SELECT * FROM users WHERE deleted = 0 AND hidden = 0;');
    }
    return sql.all();
  }

  async getUser(id: number): Promise<User | undefined> {
    const sql = await this.dbService.prepare('SELECT * FROM users WHERE id = ? AND deleted = 0;');
    return sql.get<User>(id).finally(() => sql.reset());
  }

  async createUser(name: string): Promise<void> {
    const sql = await this.dbService.prepare('INSERT INTO users (name) VALUES (?);');
    await sql.run(name);
  }

  async setVisibility(hidden: boolean, id: number): Promise<void> {
    const sql = await this.dbService.prepare('UPDATE users SET hidden = ? WHERE id = ?;');
    await sql.run(+hidden, id);
  }

  // TODO: rework into transaction system
  updateBalance(id: number, reason: string, amount: number): void {
    return; // "Disable" this method for now
    /*
    const addHistoryEntry = this.dbService.prepare('INSERT INTO History(id, user, reason, amount) VALUES (?, ?, ?, ?);');
    const updateBalance = this.dbService.prepare('UPDATE Users SET balance = balance + ? WHERE name = ?;');

    addHistoryEntry.run(v4(), id, reason, amount);
    updateBalance.run(amount, id);
    */
  }

  async deleteUser(id: number): Promise<void> {
    const sql = await this.dbService.prepare('UPDATE users SET deleted = 1 WHERE id = ?;');
    await sql.run(id);
  }
}
