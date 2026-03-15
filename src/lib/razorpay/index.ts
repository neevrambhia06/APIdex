import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize only if keys are available (for build-time safety)
const isConfigured = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

export const razorpay = isConfigured ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
}) : null;

export const createOrder = async (amount: number, currency: string = 'INR') => {
  if (!razorpay) {
    throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
  }
  
  return await razorpay.orders.create({
    amount, // Amount in paise (smallest unit)
    currency,
    receipt: `receipt_${Date.now()}`,
    notes: {
      description: 'APIdex Pro Subscription',
    },
  });
};

export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const sign = orderId + '|' + paymentId;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest('hex');

  if (signature !== expectedSign) {
    throw new Error('Invalid payment signature');
  }

  return true;
};

export const fetchPayment = async (paymentId: string) => {
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }
  return await razorpay.payments.fetch(paymentId);
};
