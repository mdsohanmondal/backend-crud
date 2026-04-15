import { Router } from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
} from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh-token', refreshTokenController);
router.post('/logout', authMiddleware, logoutController);

export default router;
