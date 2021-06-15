import {promises as fs} from 'fs';
import * as path from 'path';
import AppConfig from './models/app-config';
import {open} from 'sqlite';
import * as sqlite3 from 'sqlite3';
import {DbService} from './services/api/db.service';
import UserSettings from './models/user-settings';
import {configPath, dbPath, userSettingsPath} from './main';

const cwd = process.cwd();

const defaultConfig: AppConfig = {
  // Current config version
  version: 2,
  port: 8080,

};
const defaultUserSettings: UserSettings = {
  // Current user settings version
  version: 2,
  imprint: true,
  dataProtection: true,
  recentlyPurchased: true,
  title: 'daGl/TOBL',
  currencySymbol: '€',
  stock: true,
};
const curDbVersion = 2;

/**
 * Indicates what migrations need to performed on a component.
 */
interface MigrationMeta {
  from?: number;
  to: number;
}

async function migrateConfig(meta: MigrationMeta, backupDir?: string): Promise<void> {
  if (backupDir && meta.from !== 1) {
    await fs.copyFile(configPath, path.join(backupDir, 'config.json'));
  }

  if (meta.from === undefined) {
    // Create default config file.
    await fs.writeFile(configPath, JSON.stringify(defaultConfig));
    return;
  }

  if (meta.from === 1 && meta.to >= 2 && backupDir) {
    // Initial conversion to new config
    const settings = JSON.parse(await fs.readFile(path.join(cwd, 'data', 'settings.json'), 'utf-8'));
    const config: AppConfig = {
      version: 2,
      port: settings.port
    };
    await fs.rename(path.join(cwd, 'data', 'settings.json'), path.join(backupDir, 'settings.json'));
    await fs.writeFile(configPath, JSON.stringify(config));
  }
}

async function upgradeDb(meta: MigrationMeta, backupDir: string): Promise<void> {
  /**
   * Since database migrations are handled by the sqlite library,
   * only meta changes (like filenames or transitions to fundamentally different database structures) are handled here.
   */
  if (meta.from === 1 && meta.to >= 2) {
    // Migrate version 1 database to database version 2
    // Open old database
    const historyDb = await open({
      filename: path.join(cwd, 'data', 'history.db'),
      driver: sqlite3.Database
    });

    type userV1 = {
      name: string,
      balance: number,
      hidden: number
    };
    type beverageV1 = {
      name: string,
      stock: number,
      price: number
    };
    type transactionV1 = {
      user: string,
      reason: string,
      amount: number,
      beverage: string,
      timestamp: number | Date
    };

    // Read data from old database
    const users = await historyDb.all<userV1[]>('SELECT * FROM Users');
    const beverages = await historyDb.all<beverageV1[]>('SELECT * FROM Beverages');
    const transactions = await historyDb.all<transactionV1[]>(`SELECT user,
                                                                      reason,
                                                                      amount,
                                                                      beverage,
                                                                      STRFTIME('%s', timestamp) * 1000 AS timestamp
                                                               FROM History`);
    transactions.forEach(trans => trans.timestamp = new Date(trans.timestamp));

    // Close old database
    await historyDb.close();

    // Create new db and open
    const dbService = await DbService.create(dbPath);

    const insertUser = await dbService.prepare('INSERT INTO users (name, balance, hidden) VALUES ($name, $balance, $hidden)');
    const insertBeverage = await dbService.prepare('INSERT INTO beverages (name, price, stock) VALUES ($name, $price, $stock)');
    const getUserId = await dbService.prepare('SELECT id FROM users WHERE name = ?');
    const getBeverageId = await dbService.prepare('SELECT id FROM beverages WHERE name = ?');
    const insertTransaction = await dbService.prepare(`INSERT INTO transactions (userFrom, amount, userTo, reason, timestamp)
                                                       VALUES ($userFrom, $amount, 0, $reason, $timestamp)`);
    const insertBeverageTransaction = await dbService.prepare(`INSERT INTO transactions (userFrom, amount, userTo, reason, timestamp, beverage)
                                                               VALUES ($userFrom, $amount, 0, $reason, $timestamp, $beverage)`);

    // Insert Users
    for (const user of users) {
      await insertUser.run({$name: user.name, $balance: user.balance, $hidden: user.hidden});
    }

    // Insert Beverages
    for (const beverage of beverages) {
      await insertBeverage.run({$name: beverage.name, $price: beverage.price, $stock: beverage.stock});
    }

    // Insert Transactions
    for (const transaction of transactions) {
      const userFrom = (await getUserId.get<{ id: number }>(transaction.user))?.id;
      await getUserId.reset();
      if (userFrom === undefined) {
        // Skip transaction if user issuing transaction no longer exists.
        continue;
      }
      const beverage = (await getBeverageId.get<{ id: number }>(transaction.beverage))?.id;
      await getBeverageId.reset();
      if (beverage === undefined) {
        // Plain money credit to users
        await insertTransaction.run({
          $userFrom: userFrom,
          $amount: transaction.amount,
          $reason: transaction.reason,
          $timestamp: (transaction.timestamp as Date).getTime()
        });
      } else {
        // Beverage purchase
        await insertBeverageTransaction.run({
          $userFrom: userFrom,
          $amount: transaction.amount,
          $reason: transaction.reason,
          $timestamp: (transaction.timestamp as Date).getTime(),
          $beverage: beverage
        });
      }
    }

    // Close database
    await dbService.shutdown();

    // Move old database file to backup folder
    await fs.rename(path.join(cwd, 'data', 'history.db'), path.join(backupDir, 'history.db'));
  }
}

async function recreateAuth(backupDir: string): Promise<void> {
  const oldAuth: { password: string, root: boolean }[] = JSON.parse(await fs.readFile(path.join(cwd, 'data', 'auth.json'), 'utf-8'));

  const newAuth = {
    kiosk: oldAuth.find(auth => !auth.root)?.password,
    admin: oldAuth.find(auth => auth.root)?.password
  };

  if (backupDir) {
    await fs.rename(path.join(cwd, 'data', 'auth.json'), path.join(backupDir, 'auth.json'));
  }
  await fs.writeFile(path.join(cwd, 'data', 'auth.json'), JSON.stringify(newAuth));
}

async function migrateUserSettings(meta: MigrationMeta, backupDir?: string): Promise<void> {
  if (backupDir) {
    await fs.copyFile(userSettingsPath, path.join(backupDir, 'user-settings.json'));
  }

  if (meta.from === undefined) {
    // Create default config file.
    await fs.writeFile(userSettingsPath, JSON.stringify(defaultUserSettings));
    return;
  }

  if (meta.from === 1 && meta.to >= 2 && backupDir) {
    const userSettings: UserSettings = JSON.parse(await fs.readFile(userSettingsPath, 'utf-8'));
    userSettings.version = 2;

    await fs.writeFile(userSettingsPath, JSON.stringify(userSettings));

    await recreateAuth(backupDir);
  }
}

export async function migrate(): Promise<void> {
  let configMeta: MigrationMeta | undefined;
  let userSettingsMeta: MigrationMeta | undefined;
  let dbMeta: MigrationMeta | undefined;

  try {
    // Check for config file and extract config version
    const checkConfig: AppConfig = await fs.readFile(configPath, 'utf-8').then(JSON.parse);
    configMeta = checkConfig.version === defaultConfig.version ? undefined : {from: checkConfig.version, to: defaultConfig.version};
  } catch {
    // New config file doesn't exist
    try {
      // Check if v1 config file exists
      await fs.access(path.join(cwd, 'data', 'settings.json'));
      configMeta = {from: 1, to: defaultConfig.version};
    } catch {
      // v1 settings file doesn't exist either
      configMeta = {from: undefined, to: defaultConfig.version};
    }
  }

  try {
    // Check for settings file and extract version
    const checkSettings: UserSettings = await fs.readFile(userSettingsPath, 'utf-8').then(JSON.parse);
    if (checkSettings.hasOwnProperty('version')) {
      userSettingsMeta = checkSettings.version === defaultUserSettings.version ? undefined : {
        from: checkSettings.version,
        to: defaultUserSettings.version
      };
    } else {
      // v1 settings file does not have version attribute
      userSettingsMeta = {from: 1, to: defaultUserSettings.version};
    }
  } catch {
    // Settings file does not exist
    userSettingsMeta = {from: undefined, to: defaultUserSettings.version};
  }

  try {
    // Check if v1 database file exists
    await fs.access(path.join(cwd, 'data', 'history.db'));
    dbMeta = {from: 1, to: curDbVersion};
  } catch {
    dbMeta = undefined;
  }

  if (configMeta !== undefined || userSettingsMeta !== undefined || dbMeta !== undefined) {
    console.log('Running migrations...');

    if (configMeta && configMeta.from === undefined && userSettingsMeta && userSettingsMeta.from === undefined) {
      // Config files do not exist. Mark this run as first start so main script can serve setup website.
      process.env.firstStart = 'true';
    }

    let backupDir;
    if (!process.env.hasOwnProperty('firstStart')) {
      // Don't need a backup if there is no data to backup.
      // Create backup directories, enable recursion to avoid error if directory already exists
      await fs.mkdir(path.join(cwd, 'data', 'backup'), {recursive: true});
      backupDir = path.join(cwd, 'data', 'backup', new Date().toISOString().split(':').join('_'));
      await fs.mkdir(backupDir);

      console.log(`Backing up pre-migration data to ${backupDir}\\`);
    }

    // Only run needed migrations
    if (configMeta) {
      console.log(`Migrating config (${configMeta.from ? `v${configMeta.from}` : 'none'} => v${configMeta.to})`);
      await migrateConfig(configMeta, backupDir);
    }

    if (dbMeta && backupDir) {
      // Only touch db if there is a backup
      console.log(`Migrating db (${dbMeta.from ? `v${dbMeta.from}` : 'none'} => v${dbMeta.to})`);
      await upgradeDb(dbMeta, backupDir);
    }

    if (userSettingsMeta) {
      console.log(`Migrating user settings (${userSettingsMeta.from ? `v${userSettingsMeta.from}` : 'none'} => v${userSettingsMeta.to})`);
      await migrateUserSettings(userSettingsMeta, backupDir);
    }
    console.log('Migrations completed.');
  }
}
