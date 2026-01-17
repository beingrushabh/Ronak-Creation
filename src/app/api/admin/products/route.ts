import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Helper to check admin session
function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get('rc_admin_session');
  return !!session;
}

/**
 * Handles creating a product. Expects JSON body matching the product
 * schema. Requires admin authentication.
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabase = createClient(url, serviceKey);
    // Insert new product
    const { data, error } = await supabase.from('products').insert({
      heading: body.heading,
      price: body.price,
      discount: body.discount,
      fabric_category: body.fabricCategory,
      work_category: body.workCategory,
      measurement: body.measurement || null,
      fabric: body.fabric || null,
      work: body.work || null,
      colour: body.colour || null,
      stitch_type: body.stitchType || null,
      care_guide: body.careGuide || null,
      no_of_pieces: body.noOfPieces || null,
      available_colours_hex: body.availableColoursHex || null,
      trending: body.trending || false,
      image_url: body.image_url || null,
    }).select('*').single();
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid request' }, { status: 400 });
  }
}