import {
  getAllCategories,
  getAllListProducts,
  getAllProducts,
} from '@/controllers/products.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllProducts);
router.get('/allproducts', getAllListProducts);
router.get('/categories', getAllCategories);

export default router;
