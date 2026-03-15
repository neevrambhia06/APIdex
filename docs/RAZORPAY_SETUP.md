# Razorpay Integration Guide - APIdex

## 🇮🇳 Why Razorpay?

Razorpay is India's leading payment gateway, supporting:
- **UPI** (Google Pay, PhonePe, Paytm, etc.)
- **Cards** (Visa, Mastercard, RuPay)
- **Wallets** (Paytm, JioMoney, etc.)
- **Net Banking** (all major Indian banks)
- **EMI** options

## 📋 Prerequisites

1. **Business Registration**: You need a registered business in India
2. **Current Bank Account**: In the name of your business
3. **PAN Card**: For identity verification
4. **GST Number** (optional for some businesses)

## 🔧 Setup Steps

### 1. Create Razorpay Account

1. Go to [razorpay.com](https://razorpay.com)
2. Click "Sign Up"
3. Fill in business details
4. Complete KYC verification (takes 2-3 business days)

### 2. Get API Keys

#### Test Mode (Recommended for Development)
1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Key**
4. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

#### Live Mode (For Production)
1. Complete KYC verification
2. Go to **Settings** → **API Keys**
3. Activate **Live Mode**
4. Generate Live Keys

### 3. Configure Webhook

1. Go to **Settings** → **Webhooks**
2. Click **Add Endpoint**
3. Configure:
   - **URL**: `https://your-domain.com/api/payment/webhook`
   - **Secret**: Create a random secret (min 32 characters)
   - **Events to enable**:
     - `payment.captured` ✓
     - `payment.failed` ✓
     - `subscription.cancelled` ✓

4. Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`

### 4. Environment Variables

Update `.env.local`:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
RAZORPAY_PRO_PLAN_AMOUNT=900  # Amount in paise (₹9 = 900 paise)
```

## 💰 Pricing Configuration

### Default Setup
- **Pro Plan**: ₹9/month (900 paise)
- Amount stored in paise (smallest unit)

### To Change Price

1. Edit `.env.local`:
```env
RAZORPAY_PRO_PLAN_AMOUNT=19900  # ₹199/month
```

2. Update pricing page text in `src/app/pricing/PricingPage.tsx`

## 🧪 Testing

### Test Card Details

Use these test cards in Razorpay checkout:

| Card | Result |
|------|--------|
| 4111 1111 1111 1111 | Success |
| 4000 0000 0000 0010 | Failure |
| 5267 3181 8797 5449 | OTP Required |

### Test UPI

- Use mobile number: `9999999999`
- Any valid UPI ID format: `test@upi`

### Webhook Testing (Local Development)

Razorpay doesn't have a CLI like Stripe, but you can:

1. **Use ngrok** to expose localhost:
```bash
npm install -g ngrok
ngrok http 3000
```

2. Set webhook URL to: `https://your-ngrok-url.ngrok.io/api/payment/webhook`

3. Or manually trigger webhooks from dashboard:
   - Go to **Settings** → **Webhooks**
   - Click on your webhook
   - **Trigger Test Webhook**

## 🚀 Payment Flow

```
User clicks "Subscribe" 
    ↓
Create Razorpay Order (/api/payment/checkout)
    ↓
Show Razorpay Checkout Modal
    ↓
User completes payment
    ↓
Razorpay sends webhook (/api/payment/webhook)
    ↓
Verify & update subscription
    ↓
Redirect to /dashboard?success=true
```

## 📊 Dashboard Features

### Monitor Payments
- View all transactions
- Filter by status (Captured, Failed, Refunded)
- Download reports

### Manage Subscriptions
- Recurring payments setup
- Auto-debit configuration
- Subscription analytics

### Refunds
- Full/partial refunds
- Instant reversal to source
- Refund API available

## 🔒 Security Features

✅ **PCI DSS Compliant** - Level 1 certified  
✅ **Tokenization** - Card data never touches your server  
✅ **3D Secure** - OTP verification for cards  
✅ **Fraud Detection** - AI-powered risk analysis  
✅ **Webhook Signatures** - Verify webhook authenticity  

## 📱 Supported Payment Methods

### UPI (Most Popular)
- Google Pay
- PhonePe
- Paytm
- BHIM
- All UPI apps

### Cards
- Visa
- Mastercard
- American Express
- Diners Club
- RuPay

### Net Banking
- All major Indian banks (50+)

### Wallets
- Paytm
- FreeCharge
- JioMoney
- Mobikwik
- And more...

## 🎯 Common Issues & Solutions

### Issue: "Invalid signature"
**Solution**: Verify you're using correct Key Secret and generating signature correctly

### Issue: Webhook not firing
**Solution**: 
1. Check webhook URL is publicly accessible
2. Verify SSL certificate (HTTPS required)
3. Check firewall settings

### Issue: Payment captured but status not updated
**Solution**: 
1. Check webhook logs in Razorpay dashboard
2. Verify database connection
3. Check Supabase RLS policies

## 💡 Best Practices

1. **Always verify signatures** on webhook and payment verification
2. **Use test mode** during development
3. **Store order IDs** for tracking
4. **Handle failures gracefully** with proper error messages
5. **Send email confirmations** after successful payments
6. **Keep webhook logs** for debugging

## 🔄 Migration from Stripe

If you're migrating from Stripe:

### Database Changes
```sql
-- Already done in migration
ALTER TABLE users 
  DROP COLUMN stripe_customer_id,
  DROP COLUMN stripe_subscription_id;

ALTER TABLE users 
  ADD COLUMN razorpay_customer_id TEXT UNIQUE,
  ADD COLUMN razorpay_subscription_id TEXT UNIQUE;
```

### Code Changes
- Replace Stripe SDK with Razorpay SDK
- Update payment flow (Razorpay uses orders + signatures)
- Modify webhook handlers
- Update pricing display (₹ instead of $)

## 📈 Razorpay vs Stripe Comparison

| Feature | Razorpay | Stripe |
|---------|----------|--------|
| **India Support** | ✅ Excellent | ⚠️ Limited |
| **UPI** | ✅ Yes | ❌ No |
| **Indian Cards** | ✅ All (incl. RuPay) | ⚠️ Limited |
| **Setup Time** | 2-3 days (KYC) | Instant |
| **Transaction Fee** | 2% + GST | 2% + GST |
| **International** | ❌ No* | ✅ Yes |
| **Documentation** | Good | Excellent |

*Razorpay supports international cards on Indian websites only

## 🎓 Additional Resources

- [Razorpay Docs](https://razorpay.com/docs/)
- [API Reference](https://razorpay.com/docs/api/)
- [Integration Guides](https://razorpay.com/integration/)
- [Developer Blog](https://razorpay.com/blog/)

## 🆘 Support

- **Email**: support@razorpay.com
- **Phone**: +91-80-6873-6727
- **Hours**: 9:30 AM - 6:30 PM IST (Mon-Sat)

---

**Ready to accept payments!** 🎉

Test the integration by running:
```bash
npm run dev
```

Visit `/pricing` and click "Subscribe with Razorpay" to see the checkout modal!
