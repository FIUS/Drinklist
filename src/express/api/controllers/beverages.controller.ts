import {BeveragesService} from '../services/beverages.service';
import {IController} from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {asyncHandler, requireAdmin, requireUser} from '../api.util';
import {Beverage} from '../../models/api/beverage';

export class BeveragesController implements IController {
  path = '/beverages';
  router = Router();

  constructor(
    private beveragesService: BeveragesService,
  ) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/', requireUser, asyncHandler(this.getBeverages));
    this.router.post('/', requireAdmin, asyncHandler(this.addBeverage));
    this.router.get('/:id', requireUser, asyncHandler(this.getBeverageById));
    this.router.patch('/:beverage', requireAdmin, asyncHandler(this.updateBeverage));
    this.router.delete('/:beverage', requireAdmin, asyncHandler(this.deleteBeverage));
  }

  private getBeverages = async (req: Request, res: Response) => {
    const beverages = await this.beveragesService.getBeverages();
    res.status(200).json(beverages);
  };

  private getBeverageById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).end();
    }

    const beverage = await this.beveragesService.getBeverageById(id);
    if (!beverage) {
      return res.status(404).end();
    }

    res.status(200).json(beverage);
  };

  private addBeverage = async (req: Request, res: Response) => {
    const beverage = req.body as Beverage;

    if (!beverage || !beverage.name || isNaN(+beverage.price)) {
      return res.status(400).end();
    }

    await this.beveragesService.addBeverage(beverage);
    res.status(200).end();
  };

  private updateBeverage = async (req: Request, res: Response) => {
    const beverage = +req.params.beverage;
    const price = +req.body.price;
    const stockToAdd = +req.body.stockToAdd;

    // Invalid request if beverage is NaN or price AND stock are NaN
    if (isNaN(beverage) || isNaN(price) && isNaN(stockToAdd)) {
      res.status(400).end();
      return;
    }

    await this.beveragesService.updateBeverage(beverage, price, stockToAdd);
    res.status(200).end();
  };

  private deleteBeverage = async (req: Request, res: Response) => {
    const beverage = +req.params.beverage;

    if (isNaN(beverage)) {
      res.status(400).end();
      return;
    }

    await this.beveragesService.deleteBeverage(beverage);
    res.status(200).end();
  };
}
