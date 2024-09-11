import {
  addAddress,
  addressDetail,
  deleteAddress,
  editAddress,
  getAddress,
  getCity,
  setPrimaryAddress,
} from '@/controllers/address.controller';
import { Router } from 'express';
import { getProvince } from '../controllers/address.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';

const router = Router();

router.post('/', addAddress);
router.get('/', getAddress);
router.get('/province', getProvince);
router.get('/city', getCity);
router.get('/:id', verifyToken, addressDetail);
router.put('/:id', verifyToken, editAddress);
router.put('/primary-address/:id', verifyToken, setPrimaryAddress);
router.delete('/:id', verifyToken, deleteAddress);

export default router;
