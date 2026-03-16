import { z } from 'zod';

export const apiSchema = z.object({
  name: z.string().min(2).max(100),
  provider: z.string().min(2).max(100),
  category_id: z.string().uuid(),
  base_url: z.string().url(),
  auth_type: z.enum(['None', 'API Key', 'OAuth2', 'SDK']),
  pricing_tier: z.enum(['Free', 'Freemium', 'Paid']),
  description: z.string().min(10).max(500),
  docs_url: z.string().url(),
  use_cases: z.array(z.string()).max(10),
});

export const bookmarkSchema = z.object({
  api_id: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export const reviewSchema = z.object({
  api_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(1000),
});

export const submissionSchema = z.object({
  name: z.string().min(2).max(100),
  provider: z.string().min(2).max(100),
  category_suggestion: z.string().min(2).max(50),
  base_url: z.string().url(),
  auth_type: z.enum(['None', 'API Key', 'OAuth2', 'SDK']),
  pricing_tier: z.enum(['Free', 'Freemium', 'Paid']),
  description: z.string().min(10).max(500),
  docs_url: z.string().url(),
  use_cases: z.array(z.string()).max(10),
});

export type APISubmission = z.infer<typeof apiSchema>;
export type BookmarkSubmission = z.infer<typeof bookmarkSchema>;
export type ReviewSubmission = z.infer<typeof reviewSchema>;
export type APIPublicSubmission = z.infer<typeof submissionSchema>;
