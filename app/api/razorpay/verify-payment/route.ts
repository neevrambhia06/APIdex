import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifySubscriptionPayment } from '@/lib/razorpay';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } = await request.json();

  if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
    console.error('Missing payment verification parameters');
    return NextResponse.json({ success: false, error: 'Payment details are missing' }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error('RAZORPAY_KEY_SECRET is not defined');
    return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest('hex');

  console.log('Verifying Signature:', {
    received: razorpay_signature,
    generated: generatedSignature
  });

  if (generatedSignature !== razorpay_signature) {
    console.error('Invalid Razorpay signature for subscription:', razorpay_subscription_id);
    return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      plan: plan || 'pro',
      razorpay_subscription_id,
      subscription_status: 'active'
    })
    .eq('id', user.id);

  if (error) {
    console.error('Supabase Profile Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  try {
    await sendWelcomeEmail(user.email!, user.user_metadata.full_name || user.email!);
  } catch (emailErr) {
    console.warn('Failed to send welcome email:', emailErr);
    // Don't fail the payment verification just because the email failed
  }

  return NextResponse.json({ success: true });
}
