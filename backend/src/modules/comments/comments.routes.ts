import { Router } from 'express';
import * as commentsController from './comments.controller';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware';

// Mounted at /comments - handles comment-level CRUD
const router = Router();

router.put('/:commentId', authenticate, commentsController.updateComment);
router.delete('/:commentId', authenticate, commentsController.deleteComment);

export default router;
