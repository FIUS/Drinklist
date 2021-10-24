import {BaseController} from './base.controller';
import {asyncHandler, requireUser} from '../api.util';
import {Request, Response} from 'express';
import {TransactionsService} from '../services/transactions.service';

export class TransactionsController extends BaseController {
  constructor(
    private txnService: TransactionsService,
  ) {
    super('/transactions');
  }

  protected initRoutes(): void {
    // Cash TXNs
    this.router.get('/cash', requireUser, asyncHandler(this.getTransactions.bind(this)));
    this.router.post('/cash', requireUser, asyncHandler(this.newCashTransaction.bind(this)));
    this.router.get('/cash/:userid', requireUser, asyncHandler(this.getUserTransactions.bind(this)));
    this.router.delete('/cash/:id', requireUser, asyncHandler(this.revertCashTransaction.bind(this)));
    // Beverage TXNs
    this.router.get('/beverages', requireUser, asyncHandler(this.getTransactions.bind(this)));
    this.router.post('/beverages/order', requireUser, asyncHandler(this.orderBeverage.bind(this)));
    this.router.get('/beverages/:userid', requireUser, asyncHandler(this.getUserTransactions.bind(this)));
    this.router.delete('/beverages/:id', requireUser, asyncHandler(this.undoBeverageTransaction.bind(this)));
  }

  // Generic methods

  private async getTransactions(req: Request, res: Response): Promise<void> {
    const txnType = req.path.substr(req.path.lastIndexOf('/') + 1);
    if (txnType !== 'cash' && txnType !== 'beverages') {
      throw new Error(`Invalid path ${req.path}(${txnType}) for getTranscations()`);
    }
    let offset = +(req.query.offset || 0); // used for pagination
    let limit = +(req.query.limit || 100);

    if (req.header('x-auth-header') !== 'admin') {
      // Restrict users' ability to retrieve transactions
      offset = 0;
      // TODO: read setting (once setting exists)
      limit = limit < 10 ? limit : 10;
    }

    const transactions = await this.txnService.getTransactions(offset, limit, txnType);
    res.status(200).json(transactions);
  }

  private async getUserTransactions(req: Request, res: Response): Promise<void> {
    const txnType = req.path.substr(req.path.lastIndexOf('/') + 1);
    if (txnType !== 'cash' && txnType !== 'beverages') {
      throw new Error(`Invalid path ${req.path}(${txnType}) for getTranscations()`);
    }
    const user = +req.params.userid;

    if (isNaN(user)) {
      return res.status(400).end();
    }

    const transactions = await this.txnService.getUserTransactions(user, txnType);
    res.status(200).json(transactions);
  }

  // Cash TXNs

  private async newCashTransaction(req: Request, res: Response): Promise<void> {
    // TODO: this feature is planned, but not yet implemented
    res.status(501).end(); // not implemented
  }

  private async revertCashTransaction(req: Request, res: Response): Promise<void> {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).end();
    }

    const isRecent = await this.txnService.isRecent(id, 'cash');

    if (!isRecent && req.header('x-auth-state') === 'user') {
      // Users cannot undo old transactions
      return res.status(403).end();
    }

    if (isRecent) {
      await this.txnService.deleteCashTransaction(id);
    } else {
      await this.txnService.revertCashTransaction(id);
    }
  }

  // Beverage TXNs

  private async orderBeverage(req: Request, res: Response): Promise<void> {
    const beverage = +req.body.beverage;
    const user = +req.body.user;

    if (isNaN(beverage) || isNaN(user)) {
      return res.status(400).end();
    }

    await this.txnService.orderBeverage(beverage, user);
    res.status(204).end();
  }

  private async undoBeverageTransaction(req: Request, res: Response): Promise<void> {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).end();
    }

    const isRecent = await this.txnService.isRecent(id, 'beverages');
    if (!isRecent) {
      await this.txnService.undoBeverageTransaction(id);
    }
  }
}
