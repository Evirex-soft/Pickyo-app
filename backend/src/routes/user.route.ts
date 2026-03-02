import { Router } from 'express';
import {
  completeProfileController,
  forgotPasswordController,
  refreshTokenController,
  resetPasswordController,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Complete user profile after OAuth registration
router.put('/complete-profile', protect, completeProfileController);

// Refresh access token
router.post('/refresh', refreshTokenController);

// Forgot password
router.post('/forgot-password', authLimiter, forgotPasswordController);

// Reset password
router.post('/reset-password', authLimiter, resetPasswordController);

export default router;
