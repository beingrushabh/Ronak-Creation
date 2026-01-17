import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const isAuthenticated = () => !!cookies().get('rc_admin_session');

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.formData();
  const count = body.get('active_banner_count');
  const parsed = parseInt(String(count));
  if (isNaN(parsed) || parsed <= 0) {
    return NextResponse.json({ message: 'Invalid number' }, { status: 400 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(url, serviceKey);
  // Ensure single settings row exists
  await supabase.from('settings').update({ active_banner_count: parsed }).neq('id', '00000000-0000-0000-0000-000000000000');
  return NextResponse.redirect('/admin/settings');
}