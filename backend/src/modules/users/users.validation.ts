import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    displayName: z.string().min(1).max(50).optional(),
    bio: z.string().max(300).optional(),
    avatarUrl: z.string().url().optional(),
    isPublic: z.boolean().optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
