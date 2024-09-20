export interface Branch {
  no: number;
  id: number;
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  latitude: number;
  longitude: number;
  userId: number;
  city: {
    name: string;
  };
  province: {
    name: string;
  };
  user: {
    username: string;
  };
}
