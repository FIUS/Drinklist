export class User {
  constructor(
    public name: string,
    public balance = 0.0,
    public hidden = 0
  ) {
  }
}
