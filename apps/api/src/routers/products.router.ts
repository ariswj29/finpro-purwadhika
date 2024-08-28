import { getAllProducts } from '@/controllers/products.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllProducts);

export default router;
