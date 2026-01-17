import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Public API endpoint to fetch products with optional filters. Supports query
 * parameters: priceBucket, fabrics, works, trending, search, sort, page,
 * limit, colors. Returns JSON with an array of products and total count.
 */
export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anonKey);
  const params = req.nextUrl.searchParams;
  let query = supabase
    .from('products')
    .select('id, heading, price, discount, final_price, fabric, work, colour, stitch_type, image_url, trending', { count: 'exact' })
    .eq('is_hidden', false);
  // Filters
  const priceBucket = params.get('priceBucket');
  if (priceBucket) {
    const [minStr, maxStr] = priceBucket.split('-');
    const min = parseInt(minStr);
    const max = parseInt(maxStr);
    if (!isNaN(min)) query = query.gte('price', min);
    if (!isNaN(max)) query = query.lte('price', max);
  }
  const fabrics = params.get('fabrics');
  if (fabrics) {
    query = query.in('fabric_category', fabrics.split(','));
  }
  const works = params.get('works');
  if (works) {
    query = query.in('work_category', works.split(','));
  }
  const trending = params.get('trending');
  if (trending === 'true') {
    query = query.eq('trending', true);
  }
  const search = params.get('search');
  if (search) {
    query = query.ilike('heading', `%${search}%`);
  }
  const colors = params.get('colors');
  if (colors) {
    const cols = colors.split(',');
    cols.forEach((col) => {
      query = query.contains('available_colours_hex', [col]);
    });
  }
  // Sorting
  const sort = params.get('sort');
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'trending':
    default:
      query = query.order('trending', { ascending: false }).order('created_at', { ascending: false });
      break;
  }
  // Pagination
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '20');
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);
  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({ data, count });
}