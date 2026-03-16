import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPayment, fetchPayment } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify payment signature
    await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    // Fetch payment details to confirm amount and status
    const payment = await fetchPayment(razorpay_payment_id);
    
    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not captured' },
        { status: 400 }
      );
    }

    // Update user subscription status
    await supabase
      .from('users')
      .update({
        subscription_status: 'pro',
        razorpay_subscription_id: razorpay_payment_id,
      })
      .eq('id', user.id);

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment verification failed' },
      { status: 500 }
    );
  }
}
