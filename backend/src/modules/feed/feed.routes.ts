import { Router } from 'express';
import * as feedController from './feed.controller';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/trending', optionalAuth, feedController.getTrending);
router.get('/following', authenticate, feedController.getFollowingFeed);

export default router;
