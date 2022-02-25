import {DbService} from '../../services/api/db.service';
import {Beverage} from '../../models/api/beverage';

export class BeveragesService {
  constructor(
    private dbService: DbService,
  ) {
  }

  async getBeverages(includeDeleted = false): Promise<Beverage[]> {
    const sql = await this.dbService.prepare('SELECT * FROM beverages WHERE deleted = ?;');
    const result = await sql.all<Beverage[]>(+includeDeleted);
    result.forEach(bev => bev.deleted = Boolean(bev.deleted)); // Convert integer value
    return result;
  }

  async getBeverageById(id: number): Promise<Beverage | undefined> {
    const sql = await this.dbService.prepare('SELECT * FROM beverages WHERE id = ?;');
    try {
      const result = await sql.get<Beverage>(id);
      if (result) {
        result.deleted = Boolean(result.deleted);
      }
      return result;
    } finally {
      await sql.reset();
    }
  }

  async addBeverage(beverage: Beverage): Promise<void> {
    const sql = await this.dbService.prepare('INSERT INTO beverages (name, price, stock) VALUES (?, ?, ?);');

    // Check whether stock is NaN and default to 0 if this is the case.
    beverage.stock = isNaN(+beverage.stock) ? 0 : +beverage.stock;
    await sql.run(beverage.name, beverage.price, beverage.stock);
  }

  async updateBeverage(beverage: number, price: number, stockToAdd: number): Promise<void> {
    const updatePrice = await this.dbService.prepare('UPDATE beverages SET price = ? WHERE id = ?;');
    const updateStock = await this.dbService.prepare('UPDATE beverages SET stock = stock + ? WHERE id = ?;');

    if (!isNaN(price)) {
      await updatePrice.run(price, beverage);
    }

    if (!isNaN(stockToAdd)) {
      await updateStock.run(stockToAdd, beverage);
    }
  }

  async deleteBeverage(beverage: number): Promise<void> {
    const sql = await this.dbService.prepare('UPDATE beverages SET deleted = 1 WHERE id = ?;');
    await sql.run(beverage);
  }
}
