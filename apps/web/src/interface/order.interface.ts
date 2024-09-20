export interface Order {
  id: number;
  no: string;
  name: string;
  userId: number;
  orderDate: string;
  paymentStatus: string;
  total: number;
  user: {
    username: string;
  };
}
