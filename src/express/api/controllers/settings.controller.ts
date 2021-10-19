import {IController} from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {asyncHandler, requireAdmin} from '../api.util';
import {promises as fs} from 'fs';
import {UserSettings} from '../../models/user-settings';
import {userSettingsPath} from '../../main';

export class SettingsController implements IController {
  path = '/settings';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/', requireAdmin, asyncHandler(this.saveSettings));
  }


  private saveSettings = async (req: Request, res: Response) => {
    const settings = req.body;

    if (!UserSettings.isValid(settings)) {
      return res.status(400).end();
    }

    // If we reach this, the sent config is valid
    console.log('[settings] new user settings submitted');
    await fs.writeFile(userSettingsPath, JSON.stringify(settings));
    process.env.settingsUpdated = 'true';
    res.status(200).end();
  };
}
