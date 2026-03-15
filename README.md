# APIdex — API Universe Explorer

A modern, full-stack web application for discovering, bookmarking, and managing public APIs. Built with Next.js 14, Supabase, TypeScript, TailwindCSS, and Stripe.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Zustand** (state management)
- **Lucide React** (icons)

### Backend
- **Supabase** (PostgreSQL database + Auth)
- **Razorpay** (payments & subscriptions for India)
- **Server Components & Server Actions**

## 📁 Project Structure

```
apidex/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── apis/         # GET /api/apis
│   │   │   ├── bookmark/     # POST/DELETE bookmarks
│   │   │   ├── categories/   # GET categories
│   │   │   ├── payment/      # Razorpay checkout & webhooks
│   │   │   └── submit-api/   # Submit API endpoint
│   │   ├── dashboard/        # User dashboard
│   │   ├── explorer/         # API explorer page
│   │   ├── pricing/          # Pricing page
│   │   └── submit/           # Submit API page
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts       # Authentication hook
│   ├── lib/                  # Utilities & configurations
│   │   ├── stripe/          # Stripe helpers
│   │   ├── supabase/        # Supabase client
│   │   └── validators/      # Zod schemas
│   └── store/               # Zustand stores
├── supabase/
│   └── migrations/          # Database migrations
└── .env.local.example       # Environment variables template
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Razorpay account (for India payments)

### 1. Clone and Install Dependencies

```bash
cd apidex
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration file in your Supabase SQL editor:
   ```bash
   # Copy the contents of supabase/migrations/001_initial_schema.sql
   # Paste into Supabase SQL Editor and run
   ```

3. Get your Supabase credentials:
   - Go to Settings → API
   - Copy `URL` and `anon public` key

### 3. Set Up Razorpay (India Payments)

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Complete KYC verification (takes 2-3 business days for test mode activation)
3. Get your API keys from Dashboard → Settings → API Keys:
   - Click "Generate Test Key" or "Activate Live Mode"
   - Copy **Key ID** → `RAZORPAY_KEY_ID`
   - Copy **Key Secret** → `RAZORPAY_KEY_SECRET`

4. Set up webhook endpoint:
   - Go to Settings → Webhooks → Add endpoint
   - Endpoint URL: `https://your-domain.com/api/payment/webhook`
   - Events to enable:
     - `payment.captured`
     - `payment.failed`
     - `subscription.cancelled`
   - Create a random webhook secret and copy to `RAZORPAY_WEBHOOK_SECRET`

5. Configure pricing amount:
   - Default: ₹9/month (900 paise)
   - Update `RAZORPAY_PRO_PLAN_AMOUNT=900` in `.env.local`

📚 See `docs/RAZORPAY_SETUP.md` for detailed setup instructions, testing guide, and troubleshooting.

### 4. Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRO_PLAN_PRICE_ID=price_your_price_id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Seed the Database

Insert default API data (optional but recommended):

```typescript
// You can use the verified API dataset from the previous task
// Run this in Supabase SQL Editor or create a seed script
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Features Implemented

### Core Features
- ✅ Browse APIs with search, filter, and pagination
- ✅ Category-based filtering
- ✅ Detailed API pages with reviews
- ✅ Bookmark system (10 free, unlimited pro)
- ✅ User authentication (email + OAuth)
- ✅ API submission form
- ✅ Subscription management with Stripe

### Database Schema
- ✅ `users` - Extended Supabase users with subscription
- ✅ `apis` - API listings
- ✅ `api_categories` - 12 default categories
- ✅ `bookmarks` - User bookmarks
- ✅ `api_reviews` - User reviews
- ✅ `api_submissions` - Community submissions

### API Endpoints
- `GET /api/apis` - List all APIs (paginated, filterable)
- `GET /api/apis/:id` - Get single API details
- `GET /api/categories` - Get all categories
- `POST /api/bookmark` - Create bookmark
- `DELETE /api/bookmark/:id` - Delete bookmark
- `POST /api/submit-api` - Submit new API
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Pages
- `/explorer` - Browse and search APIs
- `/api/[id]` - Individual API details
- `/pricing` - Subscription plans
- `/dashboard` - User dashboard
- `/submit` - Submit API form

## 🔐 Authentication Flow

1. Email/password via Supabase Auth
2. OAuth providers (GitHub, Google)
3. Automatic user creation in `users` table
4. Session persistence via cookies
5. RLS policies for data security

## 💳 Subscription Tiers

### Free Plan
- Browse all APIs
- Up to 10 bookmarks
- Submit APIs for review

### Pro Plan ($9/month)
- Unlimited bookmarks
- API comparison tool
- Export Postman collections
- Priority support
- Early access to features

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to add all `.env.local` variables to Vercel's environment settings.

### Stripe Webhook Setup

For production webhooks:
1. Update webhook endpoint URL in Stripe Dashboard
2. Use production webhook secret
3. Test with Stripe CLI for local development

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 📝 Adding More APIs

To add the verified API dataset:

1. Create a seed script or
2. Insert directly via Supabase Dashboard:

```sql
INSERT INTO apis (name, provider, category_id, base_url, auth_type, pricing_tier, description, docs_url, use_cases)
VALUES 
  ('OpenAI API', 'OpenAI', (SELECT id FROM api_categories WHERE name = 'AI'), 
   'https://api.openai.com/v1', 'API Key', 'Freemium', 
   'Access GPT-4, DALL-E 3, and other cutting-edge AI models.',
   'https://platform.openai.com/docs', 
   ARRAY['Chatbots', 'Content Generation', 'Image Creation'])
  -- ... more APIs
```

## 🛡️ Security

- Row Level Security (RLS) enabled on all tables
- API validation with Zod schemas
- Environment variables for sensitive data
- Stripe webhook signature verification
- Supabase Auth for user management

## 📊 Future Enhancements

- [ ] API comparison tool
- [ ] Postman collection export
- [ ] Advanced analytics dashboard
- [ ] API health monitoring
- [ ] Rate limiting tracking
- [ ] Admin dashboard
- [ ] API key generator
- [ ] Usage statistics

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📄 License

MIT License

---

Built with ❤️ by the APIdex Team
