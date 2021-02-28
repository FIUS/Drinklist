import BeveragesService from '../services/beverages.service';
import IController from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {requireAdmin, requireUser} from '../api.util';
import Beverage from '../../models/api/beverage';

class BeveragesController implements IController {
  path = '/beverages';
  router = Router();

  constructor(
    private beveragesService: BeveragesService,
  ) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/', requireUser, this.getBeverages);
    this.router.post('/', requireAdmin, this.addBeverage);
    this.router.patch('/:beverage', requireAdmin, this.updateBeverage);
    this.router.delete('/:beverage', requireAdmin, this.deleteBeverage);
  }

  private getBeverages = (req: Request, res: Response) => {
    const beverages = this.beveragesService.getBeverages();
    res.status(200).json(beverages);
  };

  private addBeverage = (req: Request, res: Response) => {
    const beverage = req.body as Beverage;

    if (!beverage || !beverage.name || isNaN(beverage.price)) {
      res.status(400).end();
      return;
    }

    this.beveragesService.addBeverage(beverage);
    res.status(200).end();
  };

  private updateBeverage = (req: Request, res: Response) => {
    const beverage = req.params.beverage;
    const price = req.body.price as number;
    const stockToAdd = req.body.stockToAdd as number;

    // Invalid request if beverage is falsy or price AND stock are undefined
    if (!beverage || price === undefined && stockToAdd === undefined) {
      res.status(400).end();
      return;
    }

    this.beveragesService.updateBeverage(beverage, price, stockToAdd);
    res.status(200).end();
  };

  private deleteBeverage = (req: Request, res: Response) => {
    const beverage = req.params.beverage;

    if (!beverage) { // true if beverage is undefined or empty string
      res.status(400).end();
      return;
    }

    this.beveragesService.deleteBeverage(beverage);
    res.status(200).end();
  };
}

export default BeveragesController;
