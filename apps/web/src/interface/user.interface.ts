export interface User {
  id: number;
  email: string;
  password: string;
  salt: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
