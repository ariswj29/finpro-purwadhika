import {
  createUsers,
  deleteUsers,
  getAllUsers,
  getUserById,
  updateUsers,
} from '@/controllers/user.controller';
import { adminGuard, verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';

const router = Router();

router.get('/', verifyToken, getAllUsers);
router.post('/', verifyToken, createUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUsers);
router.delete('/:id', verifyToken, deleteUsers);

export default router;
