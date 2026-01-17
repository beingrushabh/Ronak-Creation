import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Public API endpoint to fetch active banners. Applies the active_banner_count
 * from settings and orders by sort_order.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anonKey);
  // fetch settings to get active banner count
  const { data: settings } = await supabase.from('settings').select('active_banner_count').single();
  const limit = settings?.active_banner_count ?? 3;
  const { data, error } = await supabase
    .from('banners')
    .select('id, name, image_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ data });
}
