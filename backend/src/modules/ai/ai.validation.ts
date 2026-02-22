import { z } from 'zod';

export const summarizeSchema = z.object({
  body: z.object({
    url: z.string().url('Invalid URL'),
    title: z.string().optional(),
    content: z.string().max(10000).optional(),
  }),
});

export const tagSuggestSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

export type SummarizeInput = z.infer<typeof summarizeSchema>['body'];
export type TagSuggestInput = z.infer<typeof tagSuggestSchema>['body'];
