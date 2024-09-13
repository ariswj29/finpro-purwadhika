import {
  createProduct,
  deleteProduct,
  getAllCategories,
  getAllListProducts,
  getAllProducts,
  product,
  products,
  updateProduct,
} from '@/controllers/products.controller';
import { upload } from '../middlewares/uploader';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/jwt.middleware';

const router = Router();

router.get('/homepage', getAllProducts);
router.get('/allproducts', getAllListProducts);
router.get('/categories', getAllCategories);
router.get('/', verifyToken, products);
router.post('/', verifyToken, upload.single('image'), createProduct);
router.get('/:id', verifyToken, product);
router.put('/:id', verifyToken, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
