import {
  createInventory,
  inventories,
  updateInventory,
} from '@/controllers/inventory.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { getBranch } from '@/controllers/branches.controller';

const router = Router();

router.get('/', verifyToken, inventories);
router.post('/', verifyToken, createInventory);
router.get('/branch/:userId', verifyToken, getBranch);
router.put('/:id', verifyToken, updateInventory);

export default router;
