import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const body = await request.json();
  const webhookSignature = (await headers()).get('x-razorpay-signature')!;

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(JSON.stringify(body))
    .digest('hex');

  if (webhookSignature !== expectedSignature) {
    console.error('Webhook signature verification failed');
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  // Create Supabase admin client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const event = body.event;

    switch (event) {
      case 'payment.captured': {
        const payment = body.payload.payment.entity;
        
        // Find user by razorpay_customer_id
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('razorpay_customer_id', `user_${payment.customer_id}`)
          .single();

        if (userData) {
          // Update subscription status
          await supabaseAdmin
            .from('users')
            .update({
              subscription_status: 'pro',
              razorpay_subscription_id: payment.id,
            })
            .eq('id', userData.id);
        }
        
        break;
      }

      case 'subscription.cancelled': {
        const subscription = body.payload.subscription.entity;
        
        await supabaseAdmin
          .from('users')
          .update({
            subscription_status: 'cancelled',
          })
          .eq('razorpay_subscription_id', subscription.id);
        
        break;
      }

      case 'payment.failed': {
        const payment = body.payload.payment.entity;
        
        console.error('Payment failed:', payment);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
