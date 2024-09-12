export interface User {
  id: number;
  email: string;
  password: string;
  salt: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}
