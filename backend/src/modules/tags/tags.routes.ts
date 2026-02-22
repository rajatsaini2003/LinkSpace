import { Router } from 'express';
import * as tagsController from './tags.controller';

const router = Router();

router.get('/', tagsController.getTags);
router.get('/trending', tagsController.getTrendingTags);
router.get('/:name', tagsController.getTagByName);

export default router;
