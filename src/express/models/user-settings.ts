class UserSettings {
  constructor(
    public imprint: boolean,
    public dataProtection: boolean,
    public recentlyPurchased: boolean,
    public title: string,
    public currencySymbol: string,
    public stock: boolean,
  ) {
  }

  static isValid(obj: any): boolean {
    // List of all properties
    const props = [
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

export default UserSettings;
