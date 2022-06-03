export interface IBeverageTransaction {
  id: number;
  beverage: number;
  units: number;
  money: number;
  user: number;
  timestamp: Date;
  cashTxn?: number;
}
