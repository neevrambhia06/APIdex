# APIdex — API Universe Explorer

APIdex is a premium platform for developers to discover, explore, and interact with public APIs. It features a curated directory, user reviews, API key vault, and real-time monitoring.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TailwindCSS, shadcn/ui.
- **Backend**: Supabase (Postgres, RLS, Auth, Storage).
- **Payments**: Razorpay (Subscriptions + One-time).
- **Email**: Resend.

## Prerequisites
- Node.js 18+
- Supabase account & project
- Razorpay account

## Setup Instructions

### 1. Initial Setup
```bash
git clone <repo-url>
cd apidex
npm install
```

### 2. Database Setup
1. Create a new project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the content of `supabase/migrations/0001_initial_schema.sql` and run it.

### 3. Payment Configuration
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Create three Plans:
   - **Pro Monthly** (₹499)
   - **Pro Annual** (₹3999)
   - **Team Monthly** (₹1499)
3. Copy the `plan_id` for each and save them for the `.env` file.

### 4. Authentication
1. In Supabase, go to **Authentication > Providers**.
2. Enable **GitHub** and **Google** OAuth by providing the respective Client IDs and Secrets.
3. Configure the redirect URI to `<your-app-url>/auth/callback`.

### 5. Environment Variables
```bash
cp .env.local.example .env.local
```
Fill in the values from your Supabase, Razorpay, and Resend accounts.

### 6. Run the App
```bash
npm run dev
```

## Deployment to Vercel
1. Push your code to GitHub.
2. Connect the repository to [Vercel](https://vercel.com).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy!

## Razorpay Webhooks
1. In Razorpay Dashboard, go to **Settings > Webhooks**.
2. Add a new webhook with URL: `https://your-domain.com/api/webhooks/razorpay`.
3. Select events: `subscription.activated`, `subscription.cancelled`, `payment.captured`, `payment.failed`.
4. Copy the Webhook Secret to your `.env` file as `RAZORPAY_WEBHOOK_SECRET`.
