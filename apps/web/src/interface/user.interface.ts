export interface User {
  id: number;
  no: number;
  username: string;
  email: string;
  password: string;
  salt: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}
