import { Router } from 'express';
import products from './products.router';
import cart from './cart.router';
import wishlist from './wishlist.router';
import auth from './auth.router';
import address from './address.router';
import orders from './order.router';
import profile from './profile.router';

const router = Router();

router.use('/api/auth', auth);
router.use('/api/products', products);
router.use('/api/cart', cart);
router.use('/api/wishlist', wishlist);
router.use('/api/address', address);
router.use('/api/orders', orders);
router.use('/api/profile', profile);

export default router;
