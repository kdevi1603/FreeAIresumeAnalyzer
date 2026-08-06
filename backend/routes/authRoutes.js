import express from 'express';
import { registerUser, loginUser, getMe, setupAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/setup-admin', setupAdmin);
router.get('/me', protect, getMe);

export default router;
