import { Router } from 'express';

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController';

import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = Router();

// Public
router.get('/', getDoctors);

router.get('/:id', getDoctorById);

// Admin only
router.post(
  '/',
  protect,
  adminOnly,
  createDoctor
);

router.put(
  '/:id',
  protect,
  adminOnly,
  updateDoctor
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteDoctor
);

export default router;