import { sign } from 'jsonwebtoken';

export const generateVerificationTokenNewEmail = (
  userId: string,
  email: string,
) => {
  const secret = process.env.JWT_SECRET_KEY || 'secret-key';
  const token = sign({ userId, email }, secret, { expiresIn: '1h' });
  return token;
};
