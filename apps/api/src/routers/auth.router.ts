import {
  login,
  register,
  verificationEmail,
} from '@/controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verification-email', verificationEmail);
export default router;
