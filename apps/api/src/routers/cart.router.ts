import { addCart, getAllCart, removeCart } from '@/controllers/cart.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCart);
router.post('/', addCart);
router.put('/remove-cart/:id', removeCart);

export default router;
