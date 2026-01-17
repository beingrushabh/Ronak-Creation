import { createClient } from "@supabase/supabase-js";
import BannerCarousel from "@/components/BannerCarousel";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";

export type SearchParams = {
  priceBucket?: string; // "500-1000" etc
  fabrics?: string;     // "net,satin"
  works?: string;       // "sequence,gliter-dori"
  trendingOnly?: string; // "true"
  sort?: string;        // "newest" | "price_asc" | "price_desc"
  search?: string;      // keyword
};

function parsePriceBucket(bucket?: string): { min?: number; max?: number } {
  if (!bucket) return {};
  const m = bucket.match(/^(\d+)-(\d+)$/);
  if (!m) return {};
  return { min: Number(m[1]), max: Number(m[2]) };
}

async function getHomeData(searchParams: SearchParams) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anonKey);

  // Fetch active banners up to active_banner_count
  const { data: settings } = await supabase.from("settings").select("active_banner_count").single();
  const bannerLimit = settings?.active_banner_count ?? 3;

  const { data: banners } = await supabase
    .from("banners")
    .select("id, name, image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(bannerLimit);

  // Trending products (separate, curated)
  const { data: trending } = await supabase
    .from("products")
    .select("id, heading, price, discount, final_price, fabric, work, colour, stitch_type, image_url, trending")
    .eq("trending", true)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(12);

  // All products query (FILTERED)
  let allQuery = supabase
    .from("products")
    .select("id, heading, price, discount, final_price, fabric, work, colour, stitch_type, image_url, trending")
    .eq("is_hidden", false);

  // Search
  if (searchParams.search?.trim()) {
    allQuery = allQuery.ilike("heading", `%${searchParams.search.trim()}%`);
  }

  // Fabric filter
  if (searchParams.fabrics) {
    const fabrics = searchParams.fabrics.split(",").map(s => s.trim()).filter(Boolean);
    if (fabrics.length) allQuery = allQuery.in("fabric", fabrics);
  }

  // Work filter
  if (searchParams.works) {
    const works = searchParams.works.split(",").map(s => s.trim()).filter(Boolean);
    if (works.length) allQuery = allQuery.in("work", works);
  }

  // Price bucket filter (on price; if you want it on final_price tell me)
  const { min, max } = parsePriceBucket(searchParams.priceBucket);
  if (typeof min === "number") allQuery = allQuery.gte("price", min);
  if (typeof max === "number") allQuery = allQuery.lte("price", max);

  // Trending only toggle (for catalog)
  if (searchParams.trendingOnly === "true") {
    allQuery = allQuery.eq("trending", true);
  }

  // Sort
  const sort = searchParams.sort ?? "newest";
  if (sort === "price_asc") allQuery = allQuery.order("price", { ascending: true });
  else if (sort === "price_desc") allQuery = allQuery.order("price", { ascending: false });
  else allQuery = allQuery.order("created_at", { ascending: false });

  // NOTE: remove .limit(8) if you truly want ALL
  const { data: all } = await allQuery.limit(24);

  // New arrivals (unfiltered, latest)
  const { data: newArrivals } = await supabase
    .from("products")
    .select("id, heading, price, discount, final_price, fabric, work, colour, stitch_type, image_url, trending")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(8);

  return { banners: banners || [], all: all || [], trending: trending || [], newArrivals: newArrivals || [] };
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { banners, all, trending, newArrivals } = await getHomeData(searchParams);

  return (
    <div className="space-y-10">
      {/* Banner */}
     {banners.length > 0 && (
  <section className="rounded-2xl overflow-hidden border border-secondary/20 bg-white/60 shadow-sm">
    <div className="h-[300px] w-full">
      <BannerCarousel banners={banners} />
    </div>
  </section>
)}


      {/* Trending - different UI */}
      {trending.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-primary">Trending Picks</h2>
            <p className="text-sm text-gray-600">Handpicked for retailers</p>
          </div>

          {/* horizontal strip */}
          <div className="-mx-1 overflow-x-auto pb-2">
            <div className="flex gap-4 px-1 snap-x snap-mandatory">
              {trending.map((p) => (
                <div key={p.id} className="min-w-[220px] max-w-[220px] snap-start">
                  <ProductGrid products={[p]} variant="trending" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catalog + Sidebar */}
      <section className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Sidebar */}
        <div className="md:sticky md:top-6">
          <div className="rounded-2xl border border-secondary/20 bg-white/70 backdrop-blur p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-primary mb-3">Filters</h3>
            <FilterSidebar />
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-primary">All Products</h2>
            <span className="text-sm text-gray-600">Showing {all.length}</span>
          </div>

          <ProductGrid products={all} />
        </div>
      </section>

      {/* New arrivals */}
      {/* {newArrivals.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-primary">New Arrivals</h2>
            <p className="text-sm text-gray-600">Latest designs added</p>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )} */}
    </div>
  );
}
