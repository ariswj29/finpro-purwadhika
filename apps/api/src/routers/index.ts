import { Router } from 'express';
import products from './products.router';

const router = Router();

router.use('/api/products', products);

export default router;
