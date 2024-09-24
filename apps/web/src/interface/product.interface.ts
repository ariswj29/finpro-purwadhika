export interface Product {
  no: number;
  id: number;
  name: string;
  price: number;
  image: string;
  totalStock: number;
  slug: string;
  description: string;
  currentStock: number;
  category: {
    name: string;
  };
  productBranchs: {
    branch: {
      name: string;
    };
    stock: number;
  }[];
}
