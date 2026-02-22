import { z } from 'zod';

export const createCollectionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    isPublic: z.boolean().default(true),
  }),
});

export const updateCollectionSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    isPublic: z.boolean().optional(),
  }),
});

export const addBookmarkToCollectionSchema = z.object({
  body: z.object({
    bookmarkId: z.string().uuid('Invalid bookmark ID'),
  }),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>['body'];
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>['body'];
export type AddBookmarkInput = z.infer<typeof addBookmarkToCollectionSchema>['body'];
