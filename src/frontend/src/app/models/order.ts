export class Order {
  constructor(
    public id: string,
    public user: string,
    public reason: string,
    public amount: number,
    public beverage: string,
    // tslint:disable-next-line:variable-name TODO: fix in backend
    public beverage_count: number,
    public timestamp: string,
  ) {
  }

  isFresh(): boolean {
    const deadline = new Date (new Date(this.timestamp).getTime() + 30000);
    return deadline > new Date();
  }
}
