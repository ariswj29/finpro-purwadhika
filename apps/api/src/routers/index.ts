import { Router } from 'express';
import products from './products.router';
import cart from './cart.router';
import wishlist from './wishlist.router';
import auth from './auth.router';
import address from './address.router';

const router = Router();

router.use('/api/auth', auth);
router.use('/api/products', products);
router.use('/api/cart', cart);
router.use('/api/wishlist', wishlist);
router.use('/api/address', address);

export default router;
