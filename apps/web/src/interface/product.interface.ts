export interface Product {
  no: number;
  id: number;
  name: string;
  price: number;
  image: string;
  totalStock: number;
  category: {
    name: string;
  };
}
