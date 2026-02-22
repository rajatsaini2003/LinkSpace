import { Router } from 'express';
import * as bookmarksController from './bookmarks.controller';
import * as commentsController from '../comments/comments.controller';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', optionalAuth, bookmarksController.getBookmarks);
router.post('/', authenticate, bookmarksController.createBookmark);
router.get('/:id', optionalAuth, bookmarksController.getBookmarkById);
router.put('/:id', authenticate, bookmarksController.updateBookmark);
router.delete('/:id', authenticate, bookmarksController.deleteBookmark);
router.post('/:id/like', authenticate, bookmarksController.likeBookmark);
router.get('/:id/comments', optionalAuth, commentsController.getCommentsByBookmark);
router.post('/:id/comments', authenticate, commentsController.createComment);

export default router;
