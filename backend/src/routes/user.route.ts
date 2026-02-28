import { Router } from 'express';
import { completeProfileController, refreshTokenController } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.put('/complete-profile', protect, completeProfileController);

router.post('/refresh', refreshTokenController);

export default router;
