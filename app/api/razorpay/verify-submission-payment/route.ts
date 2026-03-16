import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
