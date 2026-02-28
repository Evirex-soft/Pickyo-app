import { Router } from 'express';
import passport from '../config/passport';
import { googleCallback } from '../controllers/oauth.controller';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

export default router;
