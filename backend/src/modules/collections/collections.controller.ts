import { Response, NextFunction } from 'express';
import * as collectionsService from './collections.service';
import {
  createCollectionSchema,
  updateCollectionSchema,
  addBookmarkToCollectionSchema,
} from './collections.validation';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function getCollections(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const ownerId = req.query.userId as string | undefined;
    const collections = await collectionsService.getCollections(req.user?.userId, ownerId);
    sendSuccess(res, collections, 'Collections retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getCollectionById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await collectionsService.getCollectionById(req.params.id, req.user?.userId);
    sendSuccess(res, collection, 'Collection retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createCollectionSchema.parse({ body: req.body });
    const collection = await collectionsService.createCollection(req.user!.userId, body);
    sendSuccess(res, collection, 'Collection created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = updateCollectionSchema.parse({ body: req.body });
    const collection = await collectionsService.updateCollection(req.params.id, req.user!.userId, body);
    sendSuccess(res, collection, 'Collection updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await collectionsService.deleteCollection(req.params.id, req.user!.userId);
    sendSuccess(res, null, 'Collection deleted');
  } catch (err) {
    next(err);
  }
}

export async function addBookmarkToCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = addBookmarkToCollectionSchema.parse({ body: req.body });
    const result = await collectionsService.addBookmarkToCollection(req.params.id, req.user!.userId, body);
    sendSuccess(res, result, 'Bookmark added to collection');
  } catch (err) {
    next(err);
  }
}

export async function removeBookmarkFromCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await collectionsService.removeBookmarkFromCollection(
      req.params.id,
      req.params.bookmarkId,
      req.user!.userId,
    );
    sendSuccess(res, result, 'Bookmark removed from collection');
  } catch (err) {
    next(err);
  }
}
