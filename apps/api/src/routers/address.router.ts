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

const router = Router();

router.post('/', addAddress);
router.get('/', getAddress);
router.get('/province', getProvince);
router.get('/city', getCity);
router.get('/:id', addressDetail);
router.put('/:id', editAddress);
router.put('/primary-address/:id', setPrimaryAddress);
router.delete('/:id', deleteAddress);

export default router;
