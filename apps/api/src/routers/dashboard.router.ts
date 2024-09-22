import { Router } from 'express';
import { getDashboard } from '@/controllers/dashboard.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';

const router = Router();

router.get('/', verifyToken, getDashboard);

export default router;
