import DbService from '../../services/api/db.service';
import Beverage from '../../models/api/beverage';

class BeveragesService {
  constructor(
    private dbService: DbService,
  ) {
  }

  getBeverages(): Beverage[] {
    const sql = this.dbService.prepare('SELECT name, stock, price FROM Beverages ORDER BY name;');
    return sql.all();
  }

  addBeverage(beverage: Beverage): void {
    const sql = this.dbService.prepare('INSERT INTO Beverages (name, price, stock) VALUES (?, ?, ?);');

    // Check whether stock is NaN and default to 0 if this is the case.
    beverage.stock = isNaN(beverage.stock) ? 0 : beverage.stock;
    sql.run(beverage.name, beverage.price, beverage.stock);
  }

  updateBeverage(beverage: string, price: number, stockToAdd: number): void {
    const updatePrice = this.dbService.prepare('UPDATE Beverages SET price = ? WHERE name = ?;');
    const updateStock = this.dbService.prepare('UPDATE Beverages SET stock = stock + ? WHERE name = ?;');

    if (!isNaN(price)) {
      updatePrice.run(price, beverage);
    }

    if (!isNaN(stockToAdd)) {
      updateStock.run(stockToAdd, beverage);
    }
  }

  deleteBeverage(beverage: string): void {
    const sql = this.dbService.prepare('DELETE FROM Beverages WHERE name = ?;');
    sql.run(beverage);
  }
}

export default BeveragesService;
