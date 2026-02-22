import { Response, NextFunction } from 'express';
import * as feedService from './feed.service';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function getTrending(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await feedService.getTrendingFeed(page, limit, req.user?.userId);
    sendSuccess(res, result, 'Trending feed retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getFollowingFeed(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await feedService.getFollowingFeed(req.user!.userId, page, limit);
    sendSuccess(res, result, 'Following feed retrieved');
  } catch (err) {
    next(err);
  }
}
