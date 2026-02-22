import { Request, Response, NextFunction } from 'express';
import * as tagsService from './tags.service';
import { tagQuerySchema } from './tags.validation';
import { sendSuccess } from '../../utils/apiResponse';

export async function getTags(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = tagQuerySchema.parse({ search: req.query.search, limit: req.query.limit });
    const tags = await tagsService.getTags(query);
    sendSuccess(res, tags, 'Tags retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getTagByName(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tag = await tagsService.getTagByName(req.params.name);
    sendSuccess(res, tag, 'Tag retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getTrendingTags(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const tags = await tagsService.getTrendingTags(limit);
    sendSuccess(res, tags, 'Trending tags retrieved');
  } catch (err) {
    next(err);
  }
}
