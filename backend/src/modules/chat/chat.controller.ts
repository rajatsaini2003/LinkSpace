import { Response, NextFunction } from 'express';
import * as chatService from './chat.service';
import { createConversationSchema, sendMessageSchema, messagesQuerySchema } from './chat.validation';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export async function getConversations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversations = await chatService.getConversations(req.user!.userId);
    sendSuccess(res, conversations, 'Conversations retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createConversation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createConversationSchema.parse({ body: req.body });
    const conversation = await chatService.getOrCreateConversation(req.user!.userId, body.participantId);
    sendSuccess(res, conversation, 'Conversation created', 201);
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversation = await chatService.getConversationById(req.params.id, req.user!.userId);
    sendSuccess(res, conversation, 'Conversation retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = messagesQuerySchema.parse({
      page: req.query.page,
      limit: req.query.limit,
    });
    const messages = await chatService.getMessages(req.params.id, req.user!.userId, query.page, query.limit);
    sendSuccess(res, messages, 'Messages retrieved');
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = sendMessageSchema.parse({ body: req.body });
    const message = await chatService.sendMessage(req.params.id, req.user!.userId, body.content);
    sendSuccess(res, message, 'Message sent', 201);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await chatService.markRead(req.params.id, req.user!.userId);
    sendSuccess(res, null, 'Messages marked as read');
  } catch (err) {
    next(err);
  }
}
