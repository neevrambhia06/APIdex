import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOrder } from '@/lib/razorpay';

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
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount required' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await createOrder(amount);

    // Update user with Razorpay customer ID if not exists
    const { data: userData } = await supabase
      .from('users')
      .select('razorpay_customer_id')
      .eq('id', user.id)
      .single();

    if (!userData?.razorpay_customer_id) {
      // Note: Razorpay doesn't have a direct customer concept like Stripe
      // We'll just store the user info for tracking
      await supabase
        .from('users')
        .update({ 
          razorpay_customer_id: `user_${user.id}` 
        })
        .eq('id', user.id);
    }

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
