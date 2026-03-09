import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';

const router = Router();

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Logout user
router.post('/logout', logout);

export default router;
