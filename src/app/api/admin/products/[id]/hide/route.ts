import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function isAuthenticated() {
  const session = cookies().get('rc_admin_session');
  return !!session;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(url, serviceKey);
  // Fetch current is_hidden value
  const { data: product } = await supabase.from('products').select('is_hidden').eq('id', params.id).single();
  const newHidden = !(product?.is_hidden ?? false);
  const { error } = await supabase.from('products').update({ is_hidden: newHidden }).eq('id', params.id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: 'Updated' });
}