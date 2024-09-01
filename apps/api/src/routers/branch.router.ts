import { createBranch } from '@/controllers/branches.controller';
import { Router } from 'express';

const router = Router();

router.post('/', createBranch);

export default router;
