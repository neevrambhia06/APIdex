# APIdex Backend Architecture Summary

## 🎯 System Overview

APIdex is a full-stack API directory platform built with modern web technologies. The architecture follows a modular, scalable design pattern suitable for production deployments.

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Explorer │  │Dashboard │  │ Pricing  │  │  Submit  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   API Routes                        │  │
│  │  /api/apis  /api/bookmark  /api/stripe  /api/submit │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Validators │  │   Helpers    │  │   Hooks      │     │
│  │    (Zod)     │  │  (Stripe)    │  │  (useAuth)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Supabase Client (PostgreSQL)               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      External Services                      │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   Supabase   │              │    Stripe    │            │
│  │   Auth + DB  │              │  Payments    │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### Tables Created

1. **users** - Extended user profiles with subscription data
2. **api_categories** - 12 predefined categories
3. **apis** - Main API listings
4. **bookmarks** - User bookmarks (with FK to users & apis)
5. **api_reviews** - User reviews and ratings
6. **api_submissions** - Community-submitted APIs

### Key Features

- Row Level Security (RLS) enabled on all tables
- Automatic triggers for `updated_at` timestamps
- Indexes on frequently queried columns
- Foreign key constraints with cascading deletes
- Enum types for type safety

## 🔐 Authentication & Authorization

### Flow

1. User signs in via Supabase Auth
2. Session stored in cookies (HTTP-only)
3. User record created/updated in `users` table
4. RLS policies enforce data access rules
5. JWT tokens validated on each request

### Security Measures

- RLS policies prevent unauthorized access
- Zod validation on all API inputs
- Stripe webhook signature verification
- Environment variables for secrets

## 💳 Payment Integration

### Stripe Setup

- **Products**: Free & Pro plans
- **Webhooks**: Subscription lifecycle events
- **Checkout**: Hosted checkout pages
- **Portal**: Customer billing management

### Subscription States

```typescript
type SubscriptionStatus = 'free' | 'pro' | 'cancelled';
```

### Webhook Events Handled

- `checkout.session.completed` → Activate Pro
- `customer.subscription.updated` → Update status
- `customer.subscription.deleted` → Revert to Free
- `customer.deleted` → Clean up data

## 🌐 API Endpoints

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/apis` | List APIs (paginated) | No |
| GET | `/api/apis/:id` | Get API details | No |
| GET | `/api/categories` | List categories | No |

### Protected Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookmark` | Create bookmark | Yes |
| DELETE | `/api/bookmark/:id` | Delete bookmark | Yes |
| POST | `/api/submit-api` | Submit new API | Yes |
| POST | `/api/stripe/checkout` | Create session | Yes |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stripe/webhook` | Stripe webhook handler |

## 🎨 Frontend Pages

### Page Structure

```
/                  → Home (redirects to /explorer)
/explorer          → Browse & search APIs
/api/[id]          → Individual API details
/pricing           → Subscription plans
/dashboard         → User dashboard
/submit            → Submit API form
/login             → Authentication
/auth/callback     → OAuth callback handler
```

### Components

- Server Components for SEO-critical pages
- Client Components for interactive features
- Custom hooks for reusable logic
- Zustand for global state

## 🚀 Performance Optimizations

### Implemented

1. **Pagination** - APIs loaded in chunks (20 per page)
2. **Database Indexes** - Fast queries on common filters
3. **Server Components** - Reduced client-side JS
4. **Lazy Loading** - Components loaded on demand
5. **Caching** - React Query could be added for API caching

### Future Improvements

- Add Redis for caching frequently accessed data
- Implement ISR for static API detail pages
- Add CDN for static assets
- Optimize images with Next.js Image component

## 📈 Scalability Considerations

### Current Limits

- Supabase Free Tier: 500MB database, 50K monthly active users
- Stripe: Unlimited transactions
- Vercel: 100GB bandwidth (Hobby plan)

### Scaling Path

1. **Database Growth** → Upgrade Supabase plan
2. **High Traffic** → Vercel Pro + Supabase Pro
3. **Global Users** → Enable Supabase replicas
4. **Custom Domain** → Configure in Vercel

## 🔧 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev

# Test Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Production Deployment

```bash
# Push to GitHub
git push origin main

# Deploy to Vercel
# - Import repository
# - Add environment variables
# - Deploy
```

## 🛡️ Security Best Practices

### Implemented

✅ Row Level Security on all database tables  
✅ Input validation with Zod schemas  
✅ Environment variables for secrets  
✅ HTTPS-only cookies  
✅ Stripe webhook signature verification  
✅ Parameterized queries (via Supabase)  

### Recommended

⬜ Rate limiting on API endpoints  
⬜ CSRF protection  
⬜ Content Security Policy headers  
⬜ Regular security audits  
⬜ Dependency vulnerability scanning  

## 📊 Monitoring & Analytics

### To Implement

- **Error Tracking**: Sentry or LogRocket
- **Analytics**: Vercel Analytics or Plausible
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Performance**: Vercel Speed Insights
- **Logs**: Axiom or Better Stack

## 🔄 CI/CD Pipeline

### Suggested Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run lint
      - run: npm test
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📋 Checklist for Launch

### Pre-Launch

- [ ] All environment variables configured
- [ ] Stripe products and prices created
- [ ] Webhook endpoint configured in production
- [ ] Supabase migrations applied
- [ ] Default categories seeded
- [ ] OAuth providers configured (GitHub, Google)
- [ ] Custom domain set up
- [ ] SSL certificate active

### Post-Launch

- [ ] Monitor error logs
- [ ] Track user signups
- [ ] Review webhook delivery
- [ ] Check database performance
- [ ] Gather user feedback
- [ ] Plan feature roadmap

---

This architecture provides a solid foundation for a production-ready API directory platform. The modular design allows for easy maintenance and scaling as the user base grows.
