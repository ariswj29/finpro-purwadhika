import {
  getProfile,
  updateEmailRequest,
  updateProfile,
  verifyEmailChange,
} from '@/controllers/profile.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { upload } from '@/middlewares/uploader';
import { Router } from 'express';

const router = Router();

router.get('/:id', verifyToken, getProfile);
router.put('/update-email/:id', updateEmailRequest);
router.put('/verification-email/:id', verifyEmailChange);
router.put('/:id', upload.single('image'), verifyToken, updateProfile);

export default router;
