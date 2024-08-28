import { getAllCart, removeCart } from '@/controllers/cart.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCart);
router.put('/remove-cart/:id', removeCart);

export default router;
