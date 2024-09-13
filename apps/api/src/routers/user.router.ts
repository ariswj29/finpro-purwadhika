import {
  createUsers,
  deleteUsers,
  getAllUsers,
  getUserById,
  updateUsers,
} from '@/controllers/user.controller';
import { adminGuard, verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';
import { upload } from '@/middlewares/uploader';

const router = Router();

router.get('/', verifyToken, getAllUsers);
router.post('/', upload.single('image'), verifyToken, createUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', upload.single('image'), verifyToken, updateUsers);
router.delete('/:id', verifyToken, deleteUsers);

export default router;
