import { z } from 'zod';

export const tagQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type TagQueryInput = z.infer<typeof tagQuerySchema>;
