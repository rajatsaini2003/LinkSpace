import { Router } from 'express';
import * as usersController from './users.controller';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/:username', optionalAuth, usersController.getProfile);
router.put('/profile', authenticate, usersController.updateProfile);
router.post('/follow/:id', authenticate, usersController.followUser);
router.get('/:username/followers', optionalAuth, usersController.getFollowers);
router.get('/:username/following', optionalAuth, usersController.getFollowing);

export default router;
