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
import { verifyToken } from '@/middlewares/jwt.middleware';

const router = Router();

router.get('/', getAllOrderList);
router.post('/', verifyToken, createOrder);
router.get('/:id', verifyToken, getOrderDetail);
router.get('/user/:user_id', verifyToken, getOrderList);
router.get('/complete/:user_id', verifyToken, getOrderListComplete);
router.put(
  '/upload-payment/:id',
  upload.single('paymentProof'),
  verifyToken,
  changeStatus,
);
router.put('/confirm-payment/:id', verifyToken, changeStatus);
router.put('/cancel-order/:id', verifyToken, changeStatus);
router.put('/send-order/:id', verifyToken, changeStatus);
router.put('/confirm-order/:id', verifyToken, changeStatus);

export default router;
