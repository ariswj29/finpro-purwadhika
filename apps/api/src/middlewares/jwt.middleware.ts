import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

type User = {
  username: string;
  email: string;
  role: string;
};

declare namespace Express {
  export interface Request {
    user?: User;
  }
}

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Token not found');
      return res.status(401).send('Unauthorized: No token provided');
    }

    const verifyUser = verify(token, 'mySecret');

    if (!verifyUser) {
      console.log('Token verification failed');
      return res.status(401).send('Unauthorized: Invalid token');
    }

    req.user = verifyUser as any;

    next();
  } catch (err) {
    console.log('Error during token verification:', err);
    res.status(500).send({
      message: 'Internal server error',
      error: (err as Error).message,
    });
  }
};

export const adminGuard = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.role != 'USER') {
      return res.status(403).send('Forbidden');
    }
    404;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'error',
      error: (err as Error).message,
    });
  }
};
export const customerGuard = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.role != 'USER') {
      return res.status(403).send('Forbidden');
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'error',
      error: (err as Error).message,
    });
  }
};
