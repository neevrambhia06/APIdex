import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { createClient } from '@supabase/supabase-js'; // Use service role for webhooks

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) return new Response('Missing signature', { status: 400 });

  const isValid = verifyWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!);
  if (!isValid) return new Response('Invalid signature', { status: 400 });

  const event = JSON.parse(body);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  switch (event.event) {
    case 'subscription.activated':
    case 'subscription.charged':
      await supabase.from('profiles')
        .update({ 
          plan: 'pro', 
          subscription_status: 'active',
          razorpay_subscription_id: event.payload.subscription.entity.id 
        })
        .eq('razorpay_customer_id', event.payload.subscription.entity.customer_id);
      break;

    case 'subscription.cancelled':
    case 'subscription.expired':
      await supabase.from('profiles')
        .update({ plan: 'free', subscription_status: 'cancelled' })
        .eq('razorpay_subscription_id', event.payload.subscription.entity.id);
      break;

    case 'subscription.halted':
      await supabase.from('profiles')
        .update({ subscription_status: 'halted' })
        .eq('razorpay_subscription_id', event.payload.subscription.entity.id);
      break;

    case 'payment.captured':
      // Handle one-time payments if needed
      break;
      
    case 'payment.failed':
      // Handle failed payments
      break;
  }

  return NextResponse.json({ received: true });
}
