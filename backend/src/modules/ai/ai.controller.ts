import { Response, NextFunction } from 'express';
import * as aiService from './ai.service';
import { summarizeSchema, tagSuggestSchema } from './ai.validation';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function summarize(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = summarizeSchema.parse({ body: req.body });
    const result = await aiService.summarizeUrl(body);
    sendSuccess(res, result, 'Summary generated');
  } catch (err) {
    next(err);
  }
}

export async function suggestTags(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = tagSuggestSchema.parse({ body: req.body });
    const result = await aiService.suggestTags(body);
    sendSuccess(res, result, 'Tag suggestions generated');
  } catch (err) {
    next(err);
  }
}
