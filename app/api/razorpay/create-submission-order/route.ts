import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { submitter_email } = await request.json();

    const order = await razorpay.orders.create({
      amount: 49900, // ₹499
      currency: 'INR',
      receipt: `api_submission_${Date.now()}`,
      notes: {
        email: submitter_email
      }
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
