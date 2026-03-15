import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: api, error } = await supabase
      .from('apis')
      .select(`
        *,
        api_categories (
          name,
          icon,
          color
        ),
        api_reviews (
          id,
          rating,
          title,
          content,
          created_at,
          users (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !api) {
      return NextResponse.json(
        { error: 'API not found' },
        { status: 404 }
      );
    }

    // Get bookmark status for authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    let isBookmarked = false;
    
    if (user) {
      const { data: bookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('api_id', id)
        .single();
      
      isBookmarked = !!bookmark;
    }

    return NextResponse.json({
      api,
      isBookmarked,
    });
  } catch (error) {
    console.error('Error fetching API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API details' },
      { status: 500 }
    );
  }
}
