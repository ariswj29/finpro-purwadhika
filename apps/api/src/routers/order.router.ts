import {
  cancelOrder,
  confirmOrder,
  createOrder,
  getAllOrderList,
  getOrderDetail,
  getOrderList,
  getOrderListComplete,
  uploadPayment,
} from '@/controllers/order.controller';
import { Router } from 'express';
import { upload } from '../middlewares/uploadPayment';

const router = Router();

router.get('/', getAllOrderList);
router.post('/', createOrder);
router.get('/:id', getOrderList);
router.get('/complete/:id', getOrderListComplete);
router.get('/detail/:id', getOrderDetail);
router.put('/upload-payment/:id', upload.single('paymentProof'), uploadPayment);
router.put('/cancel-order/:id', cancelOrder);
router.put('/confirm-order/:id', confirmOrder);

export default router;
