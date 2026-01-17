import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const isAuthenticated = () => !!cookies().get('rc_admin_session');

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from('products').update({
    heading: body.heading,
    price: body.price,
    discount: body.discount,
    fabric_category: body.fabricCategory,
    work_category: body.workCategory,
    measurement: body.measurement ?? null,
    fabric: body.fabric ?? null,
    work: body.work ?? null,
    colour: body.colour ?? null,
    stitch_type: body.stitchType ?? null,
    care_guide: body.careGuide ?? null,
    no_of_pieces: body.noOfPieces ?? null,
    available_colours_hex: body.availableColoursHex ?? null,
    trending: body.trending ?? false,
    image_url: body.image_url ?? null,
  }).eq('id', params.id).select('*').single();
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabase = createClient(url, serviceKey);
  const { error } = await supabase.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ message: 'Deleted' });
}