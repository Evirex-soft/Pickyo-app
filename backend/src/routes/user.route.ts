import { Router } from 'express';
import {
  addSavedPlaceController,
  completeProfileController,
  deleteSavedPlaceController,
  forgotPasswordController,
  getProfileController,
  getSavedPlacesController,
  getTripsController,
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

// Get profile
router.get('/me', protect, getProfileController);

// Get trips
router.get('/trips', protect, getTripsController);

// Get saved place
router.get("/places", protect, getSavedPlacesController);

// Add place
router.post("/places", protect, addSavedPlaceController);

// Delete place
router.delete("/places/:id", protect, deleteSavedPlaceController);

export default router;
