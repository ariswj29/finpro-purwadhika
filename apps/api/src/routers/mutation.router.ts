import {
  createMutation,
  mutation,
  mutations,
  updateMutation,
} from '@/controllers/mutation.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/jwt.middleware';

const router = Router();

router.get('/', verifyToken, mutations);
router.post('/', verifyToken, createMutation);
router.get('/:id', verifyToken, mutation);
router.put('/:id', verifyToken, updateMutation);

export default router;
