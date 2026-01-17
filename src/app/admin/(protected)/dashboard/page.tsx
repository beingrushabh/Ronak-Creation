import { createClient } from '@supabase/supabase-js';

interface Counts {
  totalProducts: number;
  trendingProducts: number;
  hiddenProducts: number;
  totalBanners: number;
  activeBanners: number;
}

async function getCounts(): Promise<Counts> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(supabaseUrl, serviceKey);
  // Count products
  const total = await supabase.from('products').select('*', { count: 'exact', head: true });
  const trending = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('trending', true);
  const hidden = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_hidden', true);
  // Count banners
  const totalBanners = await supabase.from('banners').select('*', { count: 'exact', head: true });
  const activeBanners = await supabase.from('banners').select('*', { count: 'exact', head: true }).eq('is_active', true);
  return {
    totalProducts: total.count || 0,
    trendingProducts: trending.count || 0,
    hiddenProducts: hidden.count || 0,
    totalBanners: totalBanners.count || 0,
    activeBanners: activeBanners.count || 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-primary font-semibold">Total Products</h2>
          <p className="text-3xl font-bold">{counts.totalProducts}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-primary font-semibold">Trending Products</h2>
          <p className="text-3xl font-bold">{counts.trendingProducts}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-primary font-semibold">Hidden Products</h2>
          <p className="text-3xl font-bold">{counts.hiddenProducts}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-primary font-semibold">Total Banners</h2>
          <p className="text-3xl font-bold">{counts.totalBanners}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-primary font-semibold">Active Banners</h2>
          <p className="text-3xl font-bold">{counts.activeBanners}</p>
        </div>
      </div>
    </div>
  );
}