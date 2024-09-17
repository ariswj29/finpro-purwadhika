import {
  createBranch,
  deleteBranch,
  getAllBranch,
  getBranch,
  updateBranch,
} from '@/controllers/branches.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';

const router = Router();

router.post('/', verifyToken, createBranch);
router.get('/', verifyToken, getAllBranch);
router.get('/:id', verifyToken, getBranch);
router.put('/:id', verifyToken, updateBranch);
router.delete('/:id', verifyToken, deleteBranch);

export default router;
