export class Beverage {
  constructor(
    public name: string,
    public stock: number,
    public price: number
  ) {
  }

  static newEmpty(): Beverage {
    return new Beverage('', 0, 0);
  }
}
