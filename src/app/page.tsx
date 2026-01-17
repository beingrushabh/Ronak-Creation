import { createClient } from '@supabase/supabase-js';
import BannerCarousel from '@/components/BannerCarousel';
import ProductGrid from '@/components/ProductGrid';

async function getHomeData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anonKey);
  // Fetch active banners up to active_banner_count
  const { data: settings } = await supabase.from('settings').select('active_banner_count').single();
  const limit = settings?.active_banner_count ?? 3;
  const { data: banners } = await supabase
    .from('banners')
    .select('id, name, image_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  // Fetch trending products
  const { data: trending } = await supabase
    .from('products')
    .select('id, heading, price, discount, final_price, fabric, work, colour, stitch_type, image_url, trending')
    .eq('trending', true)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(8);
  // Fetch new arrivals
  const { data: newArrivals } = await supabase
    .from('products')
    .select('id, heading, price, discount, final_price, fabric, work, colour, stitch_type, image_url, trending')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(8);
  return { banners: banners || [], trending: trending || [], newArrivals: newArrivals || [] };
}

export default async function HomePage() {
  const { banners, trending, newArrivals } = await getHomeData();
  return (
    <div className="space-y-12">
      {banners.length > 0 && <BannerCarousel banners={banners} />}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary">Trending</h2>
        <ProductGrid products={trending} />
      </section>
      {newArrivals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-primary">New Arrivals</h2>
          <ProductGrid products={newArrivals} />
        </section>
      )}
    </div>
  );
}