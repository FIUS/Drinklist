export interface ICashTransaction {
  id: number;
  userFrom: number;
  amount: number;
  userTo: number;
  reason: string;
  timestamp: Date;
  beverageTxn?: number;
  reverted: boolean;
}
