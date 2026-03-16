import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/validations';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const validation = submissionSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ success: false, error: validation.error.message }, { status: 400 });

  // 1. Verify Razorpay Payment
  try {
    const payment = await razorpay.payments.fetch(validation.data.razorpay_payment_id);
    if (payment.status !== 'captured' || payment.amount !== 49900) {
       return NextResponse.json({ success: false, error: 'Invalid or incomplete payment' }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
  }

  // 2. Save Submission
  const { data, error } = await supabase
    .from('api_submissions')
    .insert({
      submitter_id: user.id,
      submitter_email: user.email!,
      ...validation.data,
      payment_verified: true
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}
