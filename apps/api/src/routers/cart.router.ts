import {
  addCart,
  getAllCart,
  getCart,
  removeCart,
} from '@/controllers/cart.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCart);
router.post('/', addCart);
router.get('/:id', getCart);
router.put('/remove-cart/:id', removeCart);

export default router;
