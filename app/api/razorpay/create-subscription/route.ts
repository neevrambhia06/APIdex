import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { plan_id } = await request.json();

  if (!plan_id) return NextResponse.json({ success: false, error: 'Plan ID required' }, { status: 400 });

  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay API keys in environment variables');
      return NextResponse.json({ success: false, error: 'Payment configuration error. Please contact admin.' }, { status: 500 });
    }

    const { data: profile } = await supabase.from('profiles').select('razorpay_customer_id').eq('id', user.id).single();
    // ... rest of the try block
    let customerId = profile?.razorpay_customer_id;

    if (!customerId) {
      console.log('Creating new Razorpay customer for user:', user.id);
      const customer = await razorpay.customers.create({
        name: user.user_metadata.full_name || user.email?.split('@')[0],
        email: user.email!,
        notes: { supabase_user_id: user.id }
      });
      customerId = customer.id;
      await supabase.from('profiles').update({ razorpay_customer_id: customerId }).eq('id', user.id);
    }

    console.log('Creating subscription for customer:', customerId, 'Plan:', plan_id);
    const subscription: any = await (razorpay.subscriptions as any).create({
      plan_id,
      customer_id: customerId,
      total_count: 120, // 10 years for monthly
      quantity: 1,
      notes: { user_id: user.id }
    });

    return NextResponse.json({ 
      success: true, 
      subscription_id: subscription.id,
      short_url: subscription.short_url 
    });

  } catch (error: any) {
    console.error('Razorpay Subscription Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create subscription',
      details: error.description || error.metadata
    }, { status: 500 });
  }
}
