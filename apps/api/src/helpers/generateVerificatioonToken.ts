import jwt from 'jsonwebtoken';
export const generateVerificationToken = (userId: number) => {
  const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

  const payload = {
    userId,
  };

  const options = {
    expiresIn: '1h',
  };

  const token = jwt.sign(payload, secretKey, options);

  return token;
};
