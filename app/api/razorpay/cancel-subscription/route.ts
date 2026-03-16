import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('razorpay_subscription_id').eq('id', user.id).single();

  if (!profile?.razorpay_subscription_id) {
    return NextResponse.json({ success: false, error: 'No active subscription' }, { status: 400 });
  }

  try {
    await razorpay.subscriptions.cancel(profile.razorpay_subscription_id);
    
    await supabase.from('profiles').update({ 
      subscription_status: 'cancelled'
    }).eq('id', user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
