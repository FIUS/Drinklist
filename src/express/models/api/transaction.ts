export interface Transaction {
  id: number;
  userFrom: number;
  amount: number;
  userTo: number;
  reason: string;
  timestamp: number;
  beverage: number;
  reverted: boolean;
}
