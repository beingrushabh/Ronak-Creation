"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { fabricCategories, workCategories } from '@/lib/validators';
import { useState, useEffect } from 'react';

const priceBuckets = [
  { label: '500–1000', value: '500-1000' },
  { label: '1000–1500', value: '1000-1500' },
  { label: '1500–2000', value: '1500-2000' },
  { label: '2000–3500', value: '2000-3500' },
];

const sortOptions = [
  { label: 'Trending first', value: 'trending' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

/**
 * FilterSidebar exposes filter controls for the catalog. When a filter is changed
 * the query parameters in the URL are updated, triggering a new fetch in the
 * parent page. Filters are multi-select where appropriate.
 */
export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state derived from query params
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [trending, setTrending] = useState<boolean>(false);
  const [sort, setSort] = useState<string>('trending');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    // Initialise state from query parameters on mount
    const price = searchParams.get('priceBucket');
    setSelectedPrice(price);

    const fabrics = searchParams.get('fabrics');
    setSelectedFabrics(fabrics ? fabrics.split(',') : []);

    const works = searchParams.get('works');
    setSelectedWorks(works ? works.split(',') : []);

    const tr = searchParams.get('trending');
    setTrending(tr === 'true');

    const sortParam = searchParams.get('sort');
    if (sortParam) setSort(sortParam);

    const searchParam = searchParams.get('search');
    if (searchParam) setSearch(searchParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQuery = (params: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else {
        newParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const toggleArrayItem = (arr: string[], item: string): string[] => {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  };

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
    updateQuery({ priceBucket: value });
  };

  const handleFabricToggle = (fabric: string) => {
    const updated = toggleArrayItem(selectedFabrics, fabric);
    setSelectedFabrics(updated);
    updateQuery({ fabrics: updated });
  };

  const handleWorkToggle = (work: string) => {
    const updated = toggleArrayItem(selectedWorks, work);
    setSelectedWorks(updated);
    updateQuery({ works: updated });
  };

  const handleTrendingToggle = () => {
    const newVal = !trending;
    setTrending(newVal);
    updateQuery({ trending: newVal });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateQuery({ sort: value });
  };

  const handleSearch = () => {
    updateQuery({ search });
  };

  return (
    <aside className="space-y-4">
      <div>
        <label htmlFor="search" className="block font-medium mb-1">Search</label>
        <div className="flex">
          <input
            id="search"
            className="flex-1 border rounded-l-md p-2 text-sm"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch} className="bg-primary text-white px-3 rounded-r-md text-sm">Go</button>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Price</h4>
        <div className="space-y-1">
          {priceBuckets.map((bucket) => (
            <label key={bucket.value} className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="priceBucket"
                value={bucket.value}
                checked={selectedPrice === bucket.value}
                onChange={() => handlePriceChange(bucket.value)}
              />
              <span>{bucket.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Fabric</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
          {fabricCategories.map((fabric) => (
            <label key={fabric} className="flex items-center space-x-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={selectedFabrics.includes(fabric)}
                onChange={() => handleFabricToggle(fabric)}
              />
              <span>{fabric.replace(/-/g, ' ')}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Work</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
          {workCategories.map((work) => (
            <label key={work} className="flex items-center space-x-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={selectedWorks.includes(work)}
                onChange={() => handleWorkToggle(work)}
              />
              <span>{work}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={trending} onChange={handleTrendingToggle} />
          <span>Trending only</span>
        </label>
      </div>
      <div>
        <label className="block font-medium mb-1">Sort</label>
        <select
          className="w-full border rounded p-2 text-sm"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}