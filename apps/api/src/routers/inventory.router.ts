import {
  createProduct,
  deleteProduct,
  inventory,
  inventorys,
  updateProduct,
} from '@/controllers/inventory.controller';
import { upload } from '../middlewares/uploader';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/jwt.middleware';

const router = Router();

router.get('/', verifyToken, inventorys);
router.post('/', verifyToken, upload.single('image'), createProduct);
router.get('/:id', verifyToken, inventory);
router.put('/:id', verifyToken, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
