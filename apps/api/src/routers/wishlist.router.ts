import { getAllWishlist } from '@/controllers/wishlist.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllWishlist);

export default router;
