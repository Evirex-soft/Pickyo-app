import { Router } from 'express';
import { acceptRideController, checkPendingRidesController, completeTripController, rejectRideController, startRideController, toggleDriverStatusController } from '../controllers/driver.controller';
import { protect } from '../middleware/auth.middleware';
import { driverStatusLimiter } from '../middleware/rateLimit.middleware';
import { allowRoles } from '../middleware/role.middleware';

const router = Router();

// Toggle driver online/offline status
router.post('/status', protect, allowRoles("driver"), driverStatusLimiter, toggleDriverStatusController);

// CheckPending rides for driver
router.get('/rides/pending', protect, allowRoles("driver"), checkPendingRidesController);

// Accept a ride request
router.post('/rides/:rideId/accept', protect, allowRoles("driver"), acceptRideController);

// Reject a ride request
router.post('/rides/:rideId/reject', protect, allowRoles("driver"), rejectRideController);

// Start a trip (verify OTP)
router.post('/rides/:rideId/start', protect, allowRoles("driver"), startRideController);

// Complete a trip
router.post('/rides/:rideId/complete', protect, allowRoles("driver"), completeTripController);

export default router;