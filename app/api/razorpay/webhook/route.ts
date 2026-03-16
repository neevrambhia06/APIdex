import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { supabaseAdmin } from '@/lib/supabase/admin';

const PLAN_MAP: Record<string, string> = {
  [process.env.NEXT_PUBLIC_RAZORPAY_LAUNCHPAD_PLAN_ID || 'plan_launchpad']: 'launchpad',
  [process.env.NEXT_PUBLIC_RAZORPAY_GALAXY_PLAN_ID || 'plan_galaxy']: 'galaxy',
  [process.env.NEXT_PUBLIC_RAZORPAY_UNIVERSA_PLAN_ID || 'plan_universa']: 'universa',
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  if (!verifyWebhookSignature(body, signature, secret)) {
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }

  const payload = JSON.parse(body);
  const event = payload.event;
  const subscription = payload.payload.subscription?.entity;
  const userId = subscription?.notes?.user_id;

  if (!userId) {
    console.error('Webhook received without user_id in notes:', event);
    return NextResponse.json({ success: true }); // Return 200 to acknowledge receipt
  }

  try {
    switch (event) {
      case 'subscription.authenticated':
      case 'subscription.activated':
      case 'subscription.charged': {
        const planName = PLAN_MAP[subscription.plan_id] || 'pro'; // Default to 'pro' if unknown
        
        await supabaseAdmin
          .from('profiles')
          .update({
            plan: planName as any,
            razorpay_subscription_id: subscription.id,
            subscription_status: 'active'
          })
          .eq('id', userId);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.halted': {
        await supabaseAdmin
          .from('profiles')
          .update({
            plan: 'orbit',
            subscription_status: event === 'subscription.cancelled' ? 'cancelled' : 'halted'
          })
          .eq('id', userId);
        break;
      }

      default:
        console.log('Unhandled Razorpay event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
