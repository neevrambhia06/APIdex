import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { bookmarkSchema } from '@/lib/validators';

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

    // Check subscription limit
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    const { data: existingBookmarks } = await supabase
      .from('bookmarks')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    const bookmarkCount = existingBookmarks?.length || 0;
    const isFreeUser = userData?.subscription_status === 'free';

    if (isFreeUser && bookmarkCount >= 10) {
      return NextResponse.json(
        { error: 'Free users can only bookmark up to 10 APIs. Upgrade to Pro for unlimited bookmarks.' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = bookmarkSchema.parse(body);

    // Create bookmark
    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        api_id: validatedData.api_id,
        notes: validatedData.notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ bookmark });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as any;
      return NextResponse.json(
        { error: 'Invalid request data', details: zodError.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}
