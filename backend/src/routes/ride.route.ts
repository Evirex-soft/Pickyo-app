import { Router } from 'express';
import { estimateRideController, getVehicleController, createRideController } from '../controllers/ride.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/estimate', protect, estimateRideController);

router.post('/vehicles', protect, getVehicleController);

router.post('/create', protect, createRideController);

export default router;