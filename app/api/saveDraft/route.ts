import { type NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, itemName, content, method } = body;
    const supabase = getSupabaseClient();

    if (!userId || !itemName || !method) {
      return NextResponse.json({
        error: 'userId, itemName, and method are required',
      }, { status: 400 });
    }

    // Check if draft exists
    const { data: existingDraft } = await supabase
      .from('report_drafts')
      .select('id')
      .eq('user_id', userId)
      .eq('item_name', itemName)
      .single();

    if (existingDraft) {
      // Update existing draft
      const { data, error } = await supabase
        .from('report_drafts')
        .update({
          content: content || '',
          method,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existingDraft.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        draft: data,
        message: 'Draft updated successfully',
      });
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from('report_drafts')
        .insert({
          user_id: userId,
          item_name: itemName,
          content: content || '',
          method,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        draft: data,
        message: 'Draft saved successfully',
      });
    }
  } catch (error: any) {
    console.error('Save draft error:', error);
    return NextResponse.json({
      error: 'Failed to save draft',
      details: error.message,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
      }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('report_drafts')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      drafts: data || [],
    });
  } catch (error: any) {
    console.error('Get drafts error:', error);
    return NextResponse.json({
      error: 'Failed to fetch drafts',
      details: error.message,
    }, { status: 500 });
  }
}

