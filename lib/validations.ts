import { z } from 'zod';

export const apiQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  pricing: z.enum(['free', 'freemium', 'paid']).optional(),
  auth_type: z.enum(['none', 'api_key', 'oauth2', 'sdk', 'bearer']).optional(),
  sort: z.enum(['popular', 'newest', 'rating']).default('popular'),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(20),
});

export const bookmarkSchema = z.object({
  api_id: z.string().uuid(),
});

export const reviewSchema = z.object({
  api_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(1000),
});

export const submissionSchema = z.object({
  api_name: z.string().min(2),
  provider: z.string().min(2),
  website_url: z.string().url(),
  base_url: z.string().url(),
  docs_url: z.string().url(),
  category_id: z.string().uuid(),
  description: z.string().min(20),
  pricing_tier: z.enum(['free', 'freemium', 'paid']),
  auth_type: z.enum(['none', 'api_key', 'oauth2', 'sdk', 'bearer']),
  reason: z.string().optional(),
  razorpay_payment_id: z.string(),
});

export const vaultSchema = z.object({
  api_id: z.string().uuid().optional(),
  label: z.string().min(2),
  key_value: z.string().min(1),
  notes: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  full_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional(),
});
