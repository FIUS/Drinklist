interface Order {
  id: string;
  user: string;
  reason: string;
  amount: number;
  beverage: string;
  beverage_count: number;
  timestamp: Date;

  fresh?: boolean;
}

export default Order;
