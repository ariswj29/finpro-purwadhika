import {
  addToWishlist,
  getAllWishlist,
  getCount,
  removeWishlist,
} from '@/controllers/wishlist.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllWishlist);
router.post('/', addToWishlist);
router.get('/count', getCount);
router.delete('/:id', removeWishlist);

export default router;
