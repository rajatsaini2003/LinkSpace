import { Response, NextFunction } from 'express';
import * as bookmarksService from './bookmarks.service';
import {
  createBookmarkSchema,
  updateBookmarkSchema,
  bookmarkQuerySchema,
} from './bookmarks.validation';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function getBookmarks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = bookmarkQuerySchema.parse({
      page: req.query.page,
      limit: req.query.limit,
      tag: req.query.tag,
      search: req.query.search || req.query.q,
      userId: req.query.userId,
    });
    const result = await bookmarksService.getBookmarks(query, req.user?.userId);
    sendSuccess(res, result, 'Bookmarks retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getMyBookmarks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = bookmarkQuerySchema.parse({
      page: req.query.page,
      limit: req.query.limit,
      tag: req.query.tag,
      search: req.query.search,
      userId: req.user!.userId,
    });
    const result = await bookmarksService.getBookmarks(query, req.user!.userId);
    sendSuccess(res, result, 'My bookmarks retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getBookmarkById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const bookmark = await bookmarksService.getBookmarkById(req.params.id, req.user?.userId);
    sendSuccess(res, bookmark, 'Bookmark retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createBookmarkSchema.parse({ body: req.body });
    const bookmark = await bookmarksService.createBookmark(req.user!.userId, body);
    sendSuccess(res, bookmark, 'Bookmark created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = updateBookmarkSchema.parse({ body: req.body });
    const bookmark = await bookmarksService.updateBookmark(req.params.id, req.user!.userId, body);
    sendSuccess(res, bookmark, 'Bookmark updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await bookmarksService.deleteBookmark(req.params.id, req.user!.userId);
    sendSuccess(res, null, 'Bookmark deleted');
  } catch (err) {
    next(err);
  }
}

export async function likeBookmark(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await bookmarksService.toggleLike(req.params.id, req.user!.userId);
    sendSuccess(res, result, result.liked ? 'Bookmark liked' : 'Bookmark unliked');
  } catch (err) {
    next(err);
  }
}

export async function getBookmarkCollections(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const collections = await bookmarksService.getBookmarkCollections(req.params.id, req.user!.userId);
    sendSuccess(res, collections, 'Bookmark collections retrieved');
  } catch (err) {
    next(err);
  }
}

export async function toggleBookmarkInCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { collectionId } = req.body;
    if (!collectionId) {
      sendSuccess(res, null, 'collectionId is required', 400);
      return;
    }
    const result = await bookmarksService.toggleBookmarkInCollection(req.params.id, collectionId, req.user!.userId);
    sendSuccess(res, result, result.saved ? 'Bookmark saved to collection' : 'Bookmark removed from collection');
  } catch (err) {
    next(err);
  }
}
