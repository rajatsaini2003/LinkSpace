import { Response, NextFunction } from 'express';
import * as commentsService from './comments.service';
import { createCommentSchema, updateCommentSchema } from './comments.validation';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function getCommentsByBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const bookmarkId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await commentsService.getCommentsByBookmark(bookmarkId, page, limit);
    sendSuccess(res, result, 'Comments retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createCommentSchema.parse({ body: req.body, params: req.params });
    const comment = await commentsService.createComment(req.params.id, req.user!.userId, body);
    sendSuccess(res, comment, 'Comment created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = updateCommentSchema.parse({ body: req.body });
    const comment = await commentsService.updateComment(req.params.commentId, req.user!.userId, body);
    sendSuccess(res, comment, 'Comment updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await commentsService.deleteComment(req.params.commentId, req.user!.userId);
    sendSuccess(res, null, 'Comment deleted');
  } catch (err) {
    next(err);
  }
}
