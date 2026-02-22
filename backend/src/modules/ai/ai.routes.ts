import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as aiController from './ai.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'Too many AI requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/summarize', authenticate, aiLimiter, aiController.summarize);
router.post('/suggest-tags', authenticate, aiLimiter, aiController.suggestTags);

export default router;
