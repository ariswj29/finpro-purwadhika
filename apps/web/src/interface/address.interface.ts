export interface Address {
  id: number;
  name: string;
  address: string;
  cityId: number;
  provinceId: number;
  postalCode: string;
  isPrimary: Boolean;
  longitude: string;
  latitude: string;
  userId: number;
  city: {
    name: string;
  };
  province: {
    name: string;
  };
}
