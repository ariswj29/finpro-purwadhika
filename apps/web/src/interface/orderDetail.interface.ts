export interface OrderDetail {
  product: {
    image: string;
    name: string;
    price: number;
  };
  quantity: number;
}
