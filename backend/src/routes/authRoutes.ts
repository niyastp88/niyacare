import { Router } from 'express';

import {
  register,
  login,forgotPassword,verifyOtp,resetPassword
} from '../controllers/authController';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.post('/verify-otp', verifyOtp);

router.post('/reset-password', resetPassword);
export default router;