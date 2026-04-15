import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import tasksRoutes from './tasks/task.route';
const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', tasksRoutes);
export default router;
