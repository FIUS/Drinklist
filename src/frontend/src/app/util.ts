import {AppConfig} from './app.config';

export class Util {
  static moneyFormat(money: number): string {
    const abs = Math.abs(money);

    const sign = money < 0 ? '-' : '';
    const wholes = Math.floor(abs / 100);
    const cents = abs % 100;

    return sign + wholes + ',' + (cents < 10 ? '0' : '') + cents + AppConfig.config.settings.currencySymbol;
  }
}
