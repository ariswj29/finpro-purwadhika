import {
  addCart,
  getAllCart,
  getCart,
  updateCart,
} from '@/controllers/cart.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCart);
router.post('/', addCart);
router.get('/:id', getCart);
router.put('/update-cart/:id', updateCart);

export default router;
