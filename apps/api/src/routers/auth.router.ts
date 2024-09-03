import {
  login,
  register,
  verificationEmail,
  verifyResetPassword,
} from '@/controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verification-email', verificationEmail);
router.post('/confirm-reset-password', verificationEmail);
router.post('/reset-password', verifyResetPassword);
export default router;
