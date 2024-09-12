import { createBranch, getBranch } from '@/controllers/branches.controller';
import { Router } from 'express';

const router = Router();

router.post('/', createBranch);
router.get('/:id', getBranch);

export default router;
