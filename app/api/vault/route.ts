import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkPlan } from '@/lib/plan-check';
import { encrypt, decrypt } from '@/lib/encryption';
import { vaultSchema } from '@/lib/validations';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const isPro = await checkPlan(user.id, 'pro');
  if (!isPro) return NextResponse.json({ success: false, error: 'Pro plan required', upgrade_url: '/pricing' }, { status: 403 });

  const { data, error } = await supabase
    .from('api_key_vault')
    .select('*, api:apis(name)')
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // Return masked keys
  const maskedData = data.map((item: any) => ({
    ...item,
    key_value: '****************' // Key is never returned raw
  }));

  return NextResponse.json({ success: true, data: maskedData });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const isPro = await checkPlan(user.id, 'pro');
  if (!isPro) return NextResponse.json({ success: false, error: 'Pro plan required', upgrade_url: '/pricing' }, { status: 403 });

  const body = await request.json();
  const validation = vaultSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ success: false, error: validation.error.message }, { status: 400 });

  const encryptedKey = encrypt(validation.data.key_value);

  const { data, error } = await supabase
    .from('api_key_vault')
    .insert({
      user_id: user.id,
      api_id: validation.data.api_id,
      label: validation.data.label,
      key_value: encryptedKey,
      notes: validation.data.notes
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data: { ...data, key_value: '****************' } });
}
