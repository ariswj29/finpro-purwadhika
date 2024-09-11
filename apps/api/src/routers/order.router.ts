import {
  changeStatus,
  createOrder,
  getAllOrderList,
  getOrderDetail,
  getOrderList,
  getOrderListComplete,
} from '@/controllers/order.controller';
import { Router } from 'express';
import { upload } from '../middlewares/uploadPayment';

const router = Router();

router.get('/', getAllOrderList);
router.post('/', createOrder);
router.get('/:id', getOrderDetail);
router.get('/user/:user_id', getOrderList);
router.get('/complete/:user_id', getOrderListComplete);
router.put(
  '/upload-payment/:id',
  upload.single('paymentProof'),

  changeStatus,
);
router.put('/confirm-payment/:id', changeStatus);
router.put('/cancel-order/:id', changeStatus);
router.put('/send-order/:id', changeStatus);
router.put('/confirm-order/:id', changeStatus);

export default router;
