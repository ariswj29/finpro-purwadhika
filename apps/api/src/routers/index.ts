import { Router } from 'express';
import products from './products.router';
import cart from './cart.router';
import wishlist from './wishlist.router';

const router = Router();

router.use('/api/products', products);
router.use('/api/cart', cart);
router.use('/api/wishlist', wishlist);

export default router;
