import IController from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import OrdersService from '../services/orders.service';
import {requireUser} from '../api.util';

class OrdersController implements IController {
  path = '/orders';
  router = Router();

  constructor(
    private ordersService: OrdersService
  ) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/', requireUser, this.getOrders);
    this.router.post('/', requireUser, this.newOrder);
    this.router.get('/:user', requireUser, this.userOrders);
    this.router.delete('/:order', requireUser, this.deleteOrder);
  }

  private newOrder = (req: Request, res: Response) => {
    const user = req.body.user as string;
    const beverage = req.body.beverage as string;
    if (user === undefined || user === '' || beverage === undefined || beverage === '') {
      res.status(400).end();
      return;
    }
    this.ordersService.newOrder(user, beverage);
    res.status(200).end();
  };

  private getOrders = (req: Request, res: Response) => {
    const latest = req.query.latest === 'true';
    const limit = +(req.query.limit || 1000);

    if (latest) {
      const latestOrders = this.ordersService.getLatestOrders();
      res.status(200).json(latestOrders);

    } else {
      if (req.header('x-auth-state') !== 'admin') {
        res.status(403).end();
      }
      const transactions = this.ordersService.getHistory(limit);
      res.status(200).json(transactions);
    }
  };

  // Maybe move this into UserController => /users/:name/orders
  private userOrders = (req: Request, res: Response) => {
    const user = req.params.user;
    if (user === undefined || user === '') {
      res.status(400).end();
    }
    const userHistory = this.ordersService.getUserHistory(user);
    res.status(200).json(userHistory);
  };

  private deleteOrder = (req: Request, res: Response) => {
    const orderId = req.params.order;

    if (orderId === undefined || orderId === '') {
      res.status(400).end();
    }

    const order = this.ordersService.getOrder(orderId, true);

    if (order === undefined) {
      res.status(404).end();
    }

    if (req.header('x-auth-state') === 'user' && !order.fresh) {
      res.status(403).end();
      return;
    }

    if (order.fresh) {
      this.ordersService.deleteOrder(order);
    } else {
      this.ordersService.revertOrder(order);
    }

    res.status(200).end();
  };
}

export default OrdersController;
