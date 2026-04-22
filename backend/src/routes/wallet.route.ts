import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { createWalletOrderController, getWalletController, verifyWalletController } from '../controllers/wallet.controller';

const router = Router();

// Get Wallet
router.get('/', protect, getWalletController);

// Create order
router.post('/create-order', protect, createWalletOrderController);

// Verify payment
router.post('/verify-payment', protect, verifyWalletController);


export default router;
