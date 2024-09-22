import { jurnals } from '@/controllers/journal.controller';
import { verifyToken } from '@/middlewares/jwt.middleware';
import { Router } from 'express';

const router = Router();

router.get('/', verifyToken, jurnals);

export default router;
