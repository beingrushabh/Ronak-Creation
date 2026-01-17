import { createClient } from '@supabase/supabase-js';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';

interface CatalogSearchParams {
  priceBucket?: string;
  fabrics?: string;
  works?: string;
  trending?: string;
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
  colors?: string;
}

async function getFilteredProducts(params: CatalogSearchParams) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anonKey);
  let query = supabase
    .from('products')
    .select('id, heading, price, discount, final_price, fabric, work, colour, stitch_type, image_url, trending')
    .eq('is_hidden', false);
  // Price bucket filtering
  if (params.priceBucket) {
    const [minStr, maxStr] = params.priceBucket.split('-');
    const min = parseInt(minStr);
    const max = parseInt(maxStr);
    if (!isNaN(min)) query = query.gte('price', min);
    if (!isNaN(max)) query = query.lte('price', max);
  }
  // Fabric and work category filtering
  if (params.fabrics) {
    const fabrics = params.fabrics.split(',');
    query = query.in('fabric_category', fabrics);
  }
  if (params.works) {
    const works = params.works.split(',');
    query = query.in('work_category', works);
  }
  // Trending toggle
  if (params.trending === 'true') {
    query = query.eq('trending', true);
  }
  // Search
  if (params.search) {
    query = query.ilike('heading', `%${params.search}%`);
  }
  // Colours multi-select filter (optional)
  if (params.colors) {
    const colors = params.colors.split(',');
    // Filter where available_colours_hex contains any of the selected colours
    colors.forEach((col) => {
      query = query.contains('available_colours_hex', [col]);
    });
  }
  // Sorting
  switch (params.sort) {
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
      // trending first (descending boolean) then newest
      query = query.order('trending', { ascending: false }).order('created_at', { ascending: false });
      break;
  }
  // Pagination
  const page = params.page ? parseInt(params.page) : 1;
  const limit = params.limit ? parseInt(params.limit) : 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export default async function CatalogPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  const products = await getFilteredProducts(searchParams);
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/4">
        <FilterSidebar />
      </div>
      <div className="flex-1">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}