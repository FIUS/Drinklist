export interface CashTransaction {
  id: number;
  userFrom: number;
  amount: number;
  userTo: number;
  reason: string;
  timestamp: number;
  beverageTxn: number;
  reverted: boolean;
}
