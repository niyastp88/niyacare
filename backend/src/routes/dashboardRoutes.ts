import { Router } from 'express';

import { getDashboardStats } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = Router();

router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;