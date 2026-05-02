import { Router } from 'express';
import { acceptRideController, checkPendingRidesController, completeTripController, deleteDriverDocumentController, getDriverProfileController, getDriverTripsController, rejectRideController, startRideController, toggleDriverStatusController, updateVehicleController, uploadDriverDocumentController } from '../controllers/driver.controller';
import { protect } from '../middleware/auth.middleware';
import { driverStatusLimiter } from '../middleware/rateLimit.middleware';
import { allowRoles } from '../middleware/role.middleware';
import multer from "multer";

const upload = multer({ dest: "uploads/" })

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

// Get trips
router.get('/trips', protect, allowRoles("driver"), getDriverTripsController);

// Get driver profile
router.get('/profile', protect, allowRoles("driver"), getDriverProfileController);

// Upload driver documents
router.post('/documents', protect, allowRoles("driver"), upload.single("file"), uploadDriverDocumentController);

// Update vehicle details
router.put('/vehicle', protect, allowRoles("driver"), updateVehicleController);

// Delete driver document
router.delete('/documents/:id', protect, allowRoles("driver"), deleteDriverDocumentController);

export default router;