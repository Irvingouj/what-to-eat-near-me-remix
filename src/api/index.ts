import express from 'express';
import { nearbyRouter } from './nearby/index.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimiter } from './middleware/rate-limiter.js';
import errorHandler from './middleware/error.js';
const router = express.Router();

router.use(authMiddleware);
router.use(rateLimiter);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
router.use('/nearby', nearbyRouter);

// Error handler must be last
router.use(errorHandler);

export default router; 