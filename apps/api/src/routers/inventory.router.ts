import {
  createInventory,
  deleteInventory,
  inventory,
  inventories,
  updateInventory,
} from '@/controllers/inventory.controller';
import { upload } from '../middlewares/uploader';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { getBranch } from '@/controllers/branches.controller';

const router = Router();

router.get('/', verifyToken, inventories);
router.post('/', verifyToken, upload.single('image'), createInventory);
router.get('/branch/:userId', verifyToken, getBranch);
router.get('/:id', verifyToken, inventory);
router.put('/:id', verifyToken, upload.single('image'), updateInventory);
router.delete('/:id', verifyToken, deleteInventory);

export default router;
