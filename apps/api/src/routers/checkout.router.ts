import { shippingCost } from '@/controllers/checkout.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';

const router = Router();

router.post('/', shippingCost);

export default router;
