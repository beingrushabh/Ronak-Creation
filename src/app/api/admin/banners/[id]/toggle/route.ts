import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const isAuthenticated = () => !!cookies().get('rc_admin_session');

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(url, serviceKey);
  const { data: banner } = await supabase.from('banners').select('is_active').eq('id', params.id).single();
  const newActive = !(banner?.is_active ?? false);
  const { error } = await supabase.from('banners').update({ is_active: newActive }).eq('id', params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ message: 'Updated' });
}