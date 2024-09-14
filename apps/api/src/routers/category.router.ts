import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from '@/controllers/category.controller';
import { adminGuard, verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';

const router = Router();

router.get('/', verifyToken, getAllCategory);
router.post('/', verifyToken, createCategory);
router.get('/:id', verifyToken, getCategoryById);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;
