export class User {
  name: string;
  balance: number;
  hidden: number;

  constructor(name: string, balance = 0.0, hidden = 0) {
    this.name = name;
    this.balance = balance;
    this.hidden = hidden;
  }
}
