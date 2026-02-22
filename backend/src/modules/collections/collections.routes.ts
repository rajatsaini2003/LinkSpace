import { Router } from 'express';
import * as collectionsController from './collections.controller';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', optionalAuth, collectionsController.getCollections);
router.get('/me', authenticate, collectionsController.getMyCollections);
router.get('/share/:slug', optionalAuth, collectionsController.getCollectionByShareSlug);
router.post('/', authenticate, collectionsController.createCollection);
router.get('/:id', optionalAuth, collectionsController.getCollectionById);
router.put('/:id', authenticate, collectionsController.updateCollection);
router.delete('/:id', authenticate, collectionsController.deleteCollection);
router.post('/:id/bookmarks', authenticate, collectionsController.addBookmarkToCollection);
router.delete('/:id/bookmarks/:bookmarkId', authenticate, collectionsController.removeBookmarkFromCollection);
router.post('/:id/clone', authenticate, collectionsController.cloneCollection);
router.post('/:id/regenerate-slug', authenticate, collectionsController.regenerateShareSlug);

export default router;
