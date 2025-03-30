import express from 'express';
import { nearbyRouter } from './nearby';
import { authMiddleware } from './middleware/auth';

const router = express.Router();

router.use(authMiddleware);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/nearby', nearbyRouter);
export default router; 