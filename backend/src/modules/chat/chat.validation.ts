import { z } from 'zod';

export const createConversationSchema = z.object({
  body: z.object({
    participantId: z.string().uuid('Invalid user ID'),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  }),
});

export const messagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(30),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>['body'];
export type SendMessageInput = z.infer<typeof sendMessageSchema>['body'];
export type MessagesQueryInput = z.infer<typeof messagesQuerySchema>;
