# ✅ Razorpay Integration Complete - APIdex

## 🎉 What Changed

APIdex now uses **Razorpay** for payment processing, optimized for the Indian market with support for UPI, cards, wallets, and net banking.

---

## 📦 New Files Created

### 1. Razorpay Library
- **`src/lib/razorpay/index.ts`** - Core Razorpay utilities
  - `createOrder()` - Create payment orders
  - `verifyPayment()` - Verify payment signatures  
  - `fetchPayment()` - Fetch payment details

### 2. Payment Routes
- **`src/app/api/payment/checkout/route.ts`** - Create Razorpay orders
- **`src/app/api/payment/webhook/route.ts`** - Handle webhook events
- **`src/app/api/payment/verify/route.ts`** - Verify completed payments

### 3. Documentation
- **`docs/RAZORPAY_SETUP.md`** - Complete setup guide (273 lines)
  - Account creation & KYC
  - API keys configuration
  - Webhook setup
  - Testing instructions
  - Troubleshooting guide

---

## 🔄 Updated Files

### Configuration
- **`.env.local.example`** - Replaced Stripe vars with Razorpay
  ```env
  RAZORPAY_KEY_ID=rzp_test_your_key_id
  RAZORPAY_KEY_SECRET=your_razorpay_key_secret
  RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
  RAZORPAY_PRO_PLAN_AMOUNT=900
  ```

### Database Schema
- **`supabase/migrations/001_initial_schema.sql`**
  - Changed `stripe_customer_id` → `razorpay_customer_id`
  - Changed `stripe_subscription_id` → `razorpay_subscription_id`

### Frontend
- **`src/app/pricing/PricingPage.tsx`**
  - Integrated Razorpay checkout modal
  - Added Razorpay Script loader
  - Changed pricing from $ to ₹ (INR)
  - Updated payment flow with signature verification

### Documentation
- **`README.md`** - Updated payment section for Razorpay
- **`ARCHITECTURE.md`** - Will be updated (pending)

---

## 🗑️ Removed Dependencies

```bash
npm uninstall stripe @stripe/stripe-js
```

## 📦 New Dependencies

```bash
npm install razorpay crypto
```

---

## 💰 Payment Flow (Razorpay)

```
┌─────────────┐
│   User      │
│  clicks     │
│ Subscribe   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  POST /api/payment/     │
│  checkout               │
│  Creates Razorpay Order │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Return Order ID,       │
│  Amount, Currency       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Open Razorpay Modal    │
│  (UPI/Cards/Wallets)    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  User Completes Payment │
│  on Razorpay            │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Razorpay Callback      │
│  (payment_id, order_id, │
│   signature)            │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  POST /api/payment/     │
│  verify                 │
│  Verifies signature     │
│  Updates subscription   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Redirect to            │
│  /dashboard?success=true│
└─────────────────────────┘
```

---

## 🔧 Setup Checklist

### 1. Razorpay Account
- [ ] Sign up at [razorpay.com](https://razorpay.com)
- [ ] Complete KYC verification
- [ ] Activate test mode or live mode

### 2. API Keys
- [ ] Generate Test/Live Key
- [ ] Copy Key ID to `.env.local`
- [ ] Copy Key Secret to `.env.local`

### 3. Webhook Configuration
- [ ] Create webhook endpoint in Razorpay dashboard
- [ ] URL: `https://your-domain.com/api/payment/webhook`
- [ ] Enable events:
  - [ ] `payment.captured`
  - [ ] `payment.failed`
  - [ ] `subscription.cancelled`
- [ ] Copy webhook secret to `.env.local`

### 4. Environment Variables
```bash
cp .env.local.example .env.local
# Fill in all RAZORPAY_* variables
```

### 5. Test Payment
- [ ] Run `npm run dev`
- [ ] Visit `/pricing`
- [ ] Click "Subscribe with Razorpay"
- [ ] Use test card: `4111 1111 1111 1111`
- [ ] Verify success redirect

---

## 🧪 Testing Credentials

### Test Cards
| Card Number | Result |
|-------------|--------|
| 4111 1111 1111 1111 | Success |
| 4000 0000 0000 0010 | Failure |
| 5267 3181 8797 5449 | OTP Required |

### Test UPI
- Mobile: `9999999999`
- UPI ID: `test@upi`

---

## 📊 Supported Payment Methods

✅ **UPI** (Google Pay, PhonePe, Paytm, BHIM)  
✅ **Cards** (Visa, Mastercard, RuPay)  
✅ **Wallets** (Paytm, FreeCharge, JioMoney)  
✅ **Net Banking** (50+ Indian banks)  
✅ **EMI** options available  

---

## 🔒 Security Features

- ✅ PCI DSS Level 1 Certified
- ✅ Tokenization (card data never touches server)
- ✅ 3D Secure (OTP verification)
- ✅ HMAC SHA-256 signature verification
- ✅ Webhook signature validation
- ✅ Server-side payment verification

---

## 💡 Key Differences from Stripe

| Feature | Stripe | Razorpay |
|---------|--------|----------|
| **India Focus** | ❌ | ✅ Excellent |
| **UPI Support** | ❌ No | ✅ Yes |
| **RuPay Cards** | ❌ Limited | ✅ Full |
| **Setup Time** | Instant | 2-3 days (KYC) |
| **Checkout** | Hosted page | Modal |
| **Currency** | USD (default) | INR |
| **Test Mode** | Easy | Requires KYC |
| **Webhooks** | CLI available | Manual testing |

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install razorpay crypto

# Uninstall old Stripe packages
npm uninstall stripe @stripe/stripe-js

# Set environment variables
cp .env.local.example .env.local
# Edit .env.local with your Razorpay keys

# Run development server
npm run dev

# Test payment
open http://localhost:3000/pricing
```

---

## 📝 API Reference

### POST /api/payment/checkout

**Request:**
```json
{
  "amount": 900
}
```

**Response:**
```json
{
  "orderId": "order_xxxxx",
  "amount": 900,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx"
}
```

### POST /api/payment/verify

**Request:**
```json
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### POST /api/payment/webhook

**Headers:**
```
x-razorpay-signature: hmac_sha256_signature
```

**Body:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxx",
        "customer_id": "user_uuid",
        "status": "captured"
      }
    }
  }
}
```

---

## 🛠️ Troubleshooting

### Issue: "Invalid signature"
**Solution:** Check that you're using the correct Key Secret and generating HMAC SHA-256 signature properly.

### Issue: Webhook not firing
**Solution:** 
1. Ensure webhook URL is publicly accessible (use ngrok for local dev)
2. Verify SSL certificate (HTTPS required)
3. Check webhook logs in Razorpay dashboard

### Issue: Payment captured but status not updated
**Solution:**
1. Check webhook endpoint is working
2. Verify Supabase connection
3. Check RLS policies on users table

---

## 📚 Resources

- **Razorpay Docs**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/
- **Integration Guide**: https://razorpay.com/integration/
- **Support**: support@razorpay.com | +91-80-6873-6727

---

## ✅ Verification Steps

Before going live:

1. **Test Mode Testing**
   - [ ] Test card payments succeed
   - [ ] Test card payments fail gracefully
   - [ ] Webhooks update database correctly
   - [ ] Subscription status changes to 'pro'
   - [ ] Redirect to dashboard works

2. **Live Mode Testing**
   - [ ] Complete KYC verification
   - [ ] Activate live mode
   - [ ] Test with real card (small amount)
   - [ ] Verify webhook signature validation
   - [ ] Test refund flow

3. **Security Checks**
   - [ ] All payments verified server-side
   - [ ] Webhook signatures validated
   - [ ] RLS policies prevent unauthorized access
   - [ ] Environment variables not exposed

---

## 🎯 Next Steps

1. **Complete Razorpay KYC** (if not done)
2. **Configure production webhook URL**
3. **Test with real payment** (₹1 transaction)
4. **Set up email notifications** for payments
5. **Add payment history** to user dashboard
6. **Implement refunds** if needed

---

**🎉 Your APIdex platform is now ready to accept payments from Indian users!**

For detailed setup instructions, see [`docs/RAZORPAY_SETUP.md`](./docs/RAZORPAY_SETUP.md).
