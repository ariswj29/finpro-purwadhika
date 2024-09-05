import { updateProfile } from '@/controllers/profile.controller';
import { upload } from '@/middlewares/uploader';
import { Router } from 'express';

const router = Router();

router.put('/:id', upload.single('image'), updateProfile);

export default router;
