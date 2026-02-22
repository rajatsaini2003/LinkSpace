import { Response, NextFunction } from 'express';
import * as usersService from './users.service';
import { updateUserSchema } from './users.validation';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AppError } from '../../middlewares/error.middleware';

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const user = await usersService.getUserById(userId);
    sendSuccess(res, user, 'Current user retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username } = req.params;
    const requesterId = req.user?.userId;
    const user = await usersService.getUserByUsername(username, requesterId);
    sendSuccess(res, user, 'User profile retrieved');
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = updateUserSchema.parse({ body: req.body });
    const userId = req.user!.userId;
    const user = await usersService.updateProfile(userId, body);
    sendSuccess(res, user, 'Profile updated');
  } catch (err) {
    next(err);
  }
}

export async function followUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const followerId = req.user!.userId;
    const followingId = req.params.id;
    const result = await usersService.followUser(followerId, followingId);
    const message = result.following ? 'Now following user' : 'Unfollowed user';
    sendSuccess(res, result, message);
  } catch (err) {
    next(err);
  }
}

export async function getFollowers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username } = req.params;
    const user = await usersService.getUserByUsername(username);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await usersService.getFollowers((user as { id: string }).id, page, limit);
    sendSuccess(res, result, 'Followers retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getFollowing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username } = req.params;
    const user = await usersService.getUserByUsername(username);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await usersService.getFollowing((user as { id: string }).id, page, limit);
    sendSuccess(res, result, 'Following retrieved');
  } catch (err) {
    next(err);
  }
}
