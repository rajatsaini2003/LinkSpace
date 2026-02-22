import { z } from 'zod';

export const createBookmarkSchema = z.object({
  body: z.object({
    url: z.string().url('Invalid URL'),
    title: z.string().min(1, 'Title is required').max(500),
    description: z.string().max(2000).optional(),
    imageUrl: z.string().url().optional(),
    isPublic: z.boolean().default(true),
    tags: z.array(z.string().min(1).max(50)).max(20).default([]),
    collectionIds: z.array(z.string().uuid()).default([]),
  }),
});

export const updateBookmarkSchema = z.object({
  body: z.object({
    url: z.string().url('Invalid URL').optional(),
    title: z.string().min(1).max(500).optional(),
    description: z.string().max(2000).optional(),
    imageUrl: z.string().url().optional().nullable(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string().min(1).max(50)).max(20).optional(),
    collectionIds: z.array(z.string().uuid()).optional(),
  }),
});

export const bookmarkQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  tag: z.string().optional(),
  search: z.string().optional(),
  userId: z.string().uuid().optional(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>['body'];
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>['body'];
export type BookmarkQueryInput = z.infer<typeof bookmarkQuerySchema>;
