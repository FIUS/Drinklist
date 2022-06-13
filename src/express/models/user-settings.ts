export class UserSettings {
  constructor(
    public version: number,
    public imprint: boolean,
    public dataProtection: boolean,
    public recentlyPurchased: boolean,
    public title: string,
    public currencySymbol: string,
    public stock: boolean,
  ) {
  }

  /**
   * Check if an object is a valid user settings object
   * @param obj the object to check
   */
  static isValid(obj: any): boolean {
    // List of all properties
    const props = [
      'version',
      'imprint',
      'dataProtection',
      'recentlyPurchased',
      'title',
      'currencySymbol',
      'stock',
    ];

    for (const key of props) {
      if (obj[key] === undefined) {
        return false;
      }
    }
    return true;
  }
}
