export interface CartItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
}
