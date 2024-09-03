import {
  addToWishlist,
  getAllWishlist,
  getCount,
  getWishlist,
  removeWishlist,
} from '@/controllers/wishlist.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllWishlist);
router.post('/', addToWishlist);
router.get('/:id', getWishlist);
router.get('/count/:id', getCount);
router.delete('/:id', removeWishlist);

export default router;
