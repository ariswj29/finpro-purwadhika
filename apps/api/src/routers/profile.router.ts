import {
  getProfile,
  updateEmailRequest,
  updateProfile,
  verifyEmailChange,
} from '@/controllers/profile.controller';
import { upload } from '@/middlewares/uploader';
import { Router } from 'express';

const router = Router();

router.get('/:id', getProfile);
router.put('/update-email/:id', updateEmailRequest);
router.put('/verification-email/:id', verifyEmailChange);
router.put('/:id', upload.single('image'), updateProfile);

export default router;
