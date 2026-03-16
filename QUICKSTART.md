# Quick Start Guide - APIdex Backend

This guide will get you up and running in 15 minutes.

## Step 1: Install Dependencies (2 min)

```bash
cd apidex
npm install
```

## Step 2: Set Up Supabase (5 min)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Wait for the database to provision
4. Go to SQL Editor → New Query
5. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Click "Run" to execute the migration

**Done!** You should see 6 tables created.

## Step 3: Get Your Credentials (2 min)

### Supabase
- Go to Settings → API
- Copy these two values:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Stripe (Skip for now if testing without payments)
- Go to [dashboard.stripe.com](https://dashboard.stripe.com)
- Developers → API keys
- Copy:
  - **Secret key** → `STRIPE_SECRET_KEY`
  - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Step 4: Configure Environment (1 min)

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional - for Stripe integration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PLAN_PRICE_ID=price_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎉 You're Running!

### What Works Now:

✅ Database schema with 6 tables  
✅ 12 default categories  
✅ Row Level Security policies  
✅ All API endpoints  

### Test the Endpoints:

```bash
# Get all categories
curl http://localhost:3000/api/categories

# Get all APIs (paginated)
curl http://localhost:3000/api/apis

# Get specific API
curl http://localhost:3000/api/apis/{id}
```

## Next Steps

### 1. Add Sample Data

Run this in Supabase SQL Editor to add sample APIs:

```sql
-- Insert sample APIs (optional)
INSERT INTO apis (name, provider, category_id, base_url, auth_type, pricing_tier, description, docs_url, use_cases)
SELECT 
  'Sample API',
  'Sample Provider',
  (SELECT id FROM api_categories WHERE name = 'AI'),
  'https://api.sample.com/v1',
  'API Key'::auth_type,
  'Free'::pricing_tier,
  'A sample API for testing',
  'https://docs.sample.com',
  ARRAY['Testing', 'Development']
```

### 2. Set Up Authentication

1. In Supabase Dashboard: Authentication → Providers
2. Enable Email provider
3. Optionally enable GitHub/Google OAuth

### 3. Configure Stripe (Optional)

If you want to test subscriptions:

1. Create a product in Stripe Dashboard
2. Name: "APIdex Pro", Price: $9/month
3. Copy the Price ID to `STRIPE_PRO_PLAN_PRICE_ID`
4. For local webhook testing:
   ```bash
   npm install -g stripe-cli
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## Troubleshooting

### "Failed to fetch categories"
- Check Supabase URL and keys in `.env.local`
- Ensure migrations ran successfully
- Check browser console for errors

### "Database does not exist"
- Wait a few minutes after creating Supabase project
- Verify the SQL migration was applied

### "CORS error"
- Make sure `NEXT_PUBLIC_APP_URL` matches your dev server
- Restart the dev server after changing env vars

## Project Structure at a Glance

```
apidex/
├── src/app/           # Pages & API routes
├── src/lib/          # Utilities (Supabase, Stripe, Validators)
├── src/hooks/        # React hooks (useAuth)
├── src/store/        # Zustand state
└── supabase/         # Database migrations
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/supabase/server.ts` | Server-side Supabase client |
| `src/lib/supabase/client.ts` | Browser-side Supabase client |
| `src/hooks/useAuth.ts` | Authentication hook |
| `src/app/api/apis/route.ts` | Main API endpoint |
| `supabase/migrations/001_initial_schema.sql` | Database schema |

## Commands Reference

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Getting Help

- Check `README.md` for detailed documentation
- Check `ARCHITECTURE.md` for system design
- Review Supabase dashboard for database issues
- Check Next.js logs for runtime errors

---

**You're all set!** 🚀 Start building your features on top of this solid foundation.
