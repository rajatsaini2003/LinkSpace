import { Router } from 'express';
import * as chatController from './chat.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, chatController.getConversations);
router.post('/', authenticate, chatController.createConversation);
router.get('/:id', authenticate, chatController.getConversation);
router.get('/:id/messages', authenticate, chatController.getMessages);
router.post('/:id/messages', authenticate, chatController.sendMessage);
router.put('/:id/read', authenticate, chatController.markRead);

export default router;
