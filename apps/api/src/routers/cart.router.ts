import {
  addCart,
  getAllCart,
  getCart,
  updateCart,
  updateQuantity,
} from '@/controllers/cart.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';

const router = Router();

router.get('/', verifyToken, getAllCart);
router.post('/', verifyToken, addCart);
router.get('/:id', verifyToken, getCart);
router.put('/update-cart/:id', verifyToken, updateCart);
router.put('/update-quantity/:id', verifyToken, updateQuantity);

export default router;
