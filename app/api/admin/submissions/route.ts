import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendSubmissionEmail } from '@/lib/resend';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  const { data, error } = await supabase
    .from('api_submissions')
    .select('*, submitter:profiles(full_name, username)')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { status, rejection_note } = await request.json();

  const { data: submission, error: fetchError } = await supabase
    .from('api_submissions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (fetchError || !submission) return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('api_submissions')
    .update({ 
      status, 
      rejection_note,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // If approved, create entry in apis table
  if (status === 'approved') {
    await supabase.from('apis').insert({
      name: submission.api_name,
      slug: submission.api_name.toLowerCase().replace(/\s+/g, '-'),
      provider: submission.provider,
      category_id: submission.category_id,
      base_url: submission.base_url,
      docs_url: submission.docs_url,
      description: submission.description,
      pricing_tier: submission.pricing_tier,
      auth_type: submission.auth_type,
      website_url: submission.website_url,
      is_active: true
    });
  }

  // Send notification email
  await sendSubmissionEmail(submission.submitter_email, status, rejection_note);

  return NextResponse.json({ success: true, data });
}
