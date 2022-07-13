import IController from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {requireAdmin} from '../api.util';
import StatsService from '../services/stats.service';

class StatsController implements IController {
  path = '/stats';
  router = Router();

  constructor(
    private statsService: StatsService,
  ) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/orders', requireAdmin, this.getOrderCount);
    this.router.get('/users', requireAdmin, this.getUserCount);
    this.router.get('/beverages', requireAdmin, this.getBeverageCount);
    this.router.get('/top/beverages', requireAdmin, this.getTopBeverages);
    this.router.get('/top/savers', requireAdmin, this.getTopSavers);
    this.router.get('/top/debtors', requireAdmin, this.getTopDebtors);
  }

  private getOrderCount = (req: Request, res: Response) => {
    const orderCount = this.statsService.getOrderCount();
    res.status(200).json(orderCount);
  };

  private getUserCount = (req: Request, res: Response) => {
    const userCount = this.statsService.getUserCount();
    res.status(200).json(userCount);
  };

  private getBeverageCount = (req: Request, res: Response) => {
    const beverageCount = this.statsService.getBeverageCount();
    res.status(200).json(beverageCount);
  };

  private getTopBeverages = (req: Request, res: Response) => {
    const topBeverages = this.statsService.getTopBeverages();
    res.status(200).json(topBeverages);
  };

  private getTopSavers = (req: Request, res: Response) => {
    const topSavers = this.statsService.getTopSavers();
    res.status(200).json(topSavers);
  };

  private getTopDebtors = (req: Request, res: Response) => {
    const topDebtors = this.statsService.getTopDebtors();
    res.status(200).json(topDebtors);
  };
}

export default StatsController;
