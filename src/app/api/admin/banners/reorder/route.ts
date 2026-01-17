import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const isAuthenticated = () => !!cookies().get('rc_admin_session');

/**
 * Reorders banners. Accepts JSON body as an array of banner IDs in the desired order.
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(url, serviceKey);
  // Iterate and update sort_order for each id
  for (let i = 0; i < body.length; i++) {
    const id = body[i];
    await supabase.from('banners').update({ sort_order: i + 1 }).eq('id', id);
  }
  return NextResponse.json({ message: 'Reordered' });
}