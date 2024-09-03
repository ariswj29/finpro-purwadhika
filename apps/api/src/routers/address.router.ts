import {
  addAddress,
  getAddress,
  getCity,
} from '@/controllers/address.controller';
import { Router } from 'express';
import { getProvince } from '../controllers/address.controller';

const router = Router();

router.post('/', addAddress);
router.get('/', getAddress);
router.get('/province', getProvince);
router.get('/city', getCity);

export default router;
