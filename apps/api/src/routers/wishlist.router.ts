import {
  addToWishlist,
  getAllWishlist,
  getCount,
  getWishlist,
  removeWishlist,
} from '@/controllers/wishlist.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';

const router = Router();

router.get('/', verifyToken, getAllWishlist);
router.post('/', verifyToken, addToWishlist);
router.get('/:id', verifyToken, getWishlist);
router.get('/count/:id', getCount);
router.delete('/:id', verifyToken, removeWishlist);

export default router;
