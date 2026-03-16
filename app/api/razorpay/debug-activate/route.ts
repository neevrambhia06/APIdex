import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { plan } = await request.json();
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[DEBUG] Manually activating plan "${plan}" for user ${user.id}`);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        plan: plan,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[DEBUG] Profile update failed:', updateError);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Plan ${plan} activated via debug bypass.` 
    });

  } catch (error: any) {
    console.error('[DEBUG] Bypass error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
