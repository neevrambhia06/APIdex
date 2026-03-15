import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { submissionSchema } from '@/lib/validators';

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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = submissionSchema.parse(body);

    // Create API submission
    const { data: submission, error } = await supabase
      .from('api_submissions')
      .insert({
        user_id: user.id,
        name: validatedData.name,
        provider: validatedData.provider,
        category_suggestion: validatedData.category_suggestion,
        base_url: validatedData.base_url,
        auth_type: validatedData.auth_type,
        pricing_tier: validatedData.pricing_tier,
        description: validatedData.description,
        docs_url: validatedData.docs_url,
        use_cases: validatedData.use_cases,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      submission,
      message: 'API submitted successfully! It will be reviewed by our team.',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as any;
      return NextResponse.json(
        { error: 'Invalid request data', details: zodError.errors },
        { status: 400 }
      );
    }
    
    console.error('Error submitting API:', error);
    return NextResponse.json(
      { error: 'Failed to submit API' },
      { status: 500 }
    );
  }
}
