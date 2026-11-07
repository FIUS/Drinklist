import IController from '../../interfaces/controller.interface';
import {NextFunction, Request, Response, Router} from 'express';
import BankImportService from '../services/bank-import.service';
import {requireAdmin} from '../api.util';
import * as fs from 'fs';

class BankImportController implements IController {
  path = '/bank-import';
  router = Router();

  private rootDir = fs.realpathSync('./');

  constructor(
    private bankImportService: BankImportService
  ) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/preview', requireAdmin, this.previewCsv);
    this.router.post('/confirm', requireAdmin, this.confirmImport);
    this.router.get('/history', requireAdmin, this.getHistory);
    this.router.get('/invoice/:id/pdf', requireAdmin, this.getInvoicePdf);
    this.router.post('/invoices/batch-pdf', requireAdmin, this.getBatchPdf);
    this.router.get('/settings', requireAdmin, this.getSettings);
    this.router.put('/settings', requireAdmin, this.updateSettings);
    this.router.post('/template/sample-pdf', requireAdmin, this.getSamplePdf);
    this.router.delete('/mappings', requireAdmin, this.deleteMapping);
  }

  private getCurrencySymbol(): string {
    try {
      const userSettings = JSON.parse(fs.readFileSync(`${this.rootDir}/data/user-settings.json`, 'utf8'));
      return userSettings.currencySymbol || '€';
    } catch {
      return '€';
    }
  }

  private previewCsv = (req: Request, res: Response, next: NextFunction) => {
    try {
      const csvContent = req.body.csvContent as string;
      const preview = this.bankImportService.previewCsv(csvContent);
      res.status(200).json(preview);
    } catch (err) {
      next(err);
    }
  };

  private confirmImport = (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = req.body.items;
      const records = this.bankImportService.confirmImport(items, this.getCurrencySymbol());
      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  };

  private getHistory = (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = this.bankImportService.getImportHistory(500);
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  };

  private getInvoicePdf = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const recompile = req.query.recompile === 'true';
      const {buffer, fileName} = this.bankImportService.getOrCreateInvoicePdf(
        id,
        this.getCurrencySymbol(),
        recompile
      );
      res
        .status(200)
        .contentType('application/pdf')
        .setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        .send(buffer);
    } catch (err) {
      next(err);
    }
  };

  private getBatchPdf = (req: Request, res: Response, next: NextFunction) => {
    try {
      const ids = req.body.ids as string[];
      const {buffer, fileName} = this.bankImportService.compileBatchPdf(ids, this.getCurrencySymbol());
      res
        .status(200)
        .contentType('application/pdf')
        .setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        .send(buffer);
    } catch (err) {
      next(err);
    }
  };

  private getSettings = (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = this.bankImportService.getSettings();
      const template = this.bankImportService.getTemplate();
      const mappings = this.bankImportService.getMappings();
      res.status(200).json({settings, template, mappings});
    } catch (err) {
      next(err);
    }
  };

  private updateSettings = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.settings) {
        this.bankImportService.updateSettings(req.body.settings);
      }
      if (typeof req.body.template === 'string') {
        this.bankImportService.updateTemplate(req.body.template);
      }
      const settings = this.bankImportService.getSettings();
      const template = this.bankImportService.getTemplate();
      const mappings = this.bankImportService.getMappings();
      res.status(200).json({settings, template, mappings});
    } catch (err) {
      next(err);
    }
  };

  private getSamplePdf = (req: Request, res: Response, next: NextFunction) => {
    try {
      const customTemplate = typeof req.body.template === 'string' ? req.body.template : undefined;
      const buffer = this.bankImportService.compileSamplePdf(customTemplate, this.getCurrencySymbol());
      res
        .status(200)
        .contentType('application/pdf')
        .setHeader('Content-Disposition', 'attachment; filename="sample-invoice.pdf"')
        .send(buffer);
    } catch (err) {
      next(err);
    }
  };

  private deleteMapping = (req: Request, res: Response, next: NextFunction) => {
    try {
      const bankIdentifier = (req.query.id as string) || (req.body && req.body.bankIdentifier);
      if (!bankIdentifier) {
        res.status(400).end();
        return;
      }
      this.bankImportService.deleteMapping(bankIdentifier);
      res.status(200).json(this.bankImportService.getMappings());
    } catch (err) {
      next(err);
    }
  };
}

export default BankImportController;
