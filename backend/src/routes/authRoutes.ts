// Auth routes
import { Router } from 'express';
import { login, verifyMfa, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/mfa/verify', verifyMfa);
router.post('/logout', authenticate, logout);

export default router;

