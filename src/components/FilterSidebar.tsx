"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fabricCategories, workCategories } from "@/lib/validators";
import { useEffect, useMemo, useState } from "react";

const priceBuckets = [
  { label: "500–1000", value: "500-1000" },
  { label: "1000–1500", value: "1000-1500" },
  { label: "1500–2000", value: "1500-2000" },
  { label: "2000–3500", value: "2000-3500" },
];

const sortOptions = [
  { label: "Trending first", value: "trending" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

type Chip =
  | { type: "price"; label: string; value: string }
  | { type: "fabric"; label: string; value: string }
  | { type: "work"; label: string; value: string }
  | { type: "trending"; label: string; value: "true" }
  | { type: "search"; label: string; value: string };

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state derived from query params
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [trending, setTrending] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("trending");
  const [search, setSearch] = useState<string>("");

  // Dropdown temporary value (so selecting adds to chips, then resets dropdown)
  const [fabricToAdd, setFabricToAdd] = useState<string>("");
  const [workToAdd, setWorkToAdd] = useState<string>("");

  // Init from URL
  useEffect(() => {
    const price = searchParams.get("priceBucket");
    setSelectedPrice(price);

    const fabrics = searchParams.get("fabrics");
    setSelectedFabrics(fabrics ? fabrics.split(",").filter(Boolean) : []);

    const works = searchParams.get("works");
    setSelectedWorks(works ? works.split(",").filter(Boolean) : []);

    const tr = searchParams.get("trending");
    setTrending(tr === "true");

    const sortParam = searchParams.get("sort");
    if (sortParam) setSort(sortParam);

    const searchParam = searchParams.get("search");
    setSearch(searchParam ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQuery = (params: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        newParams.delete(key);
      } else {
        newParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });

    const qs = newParams.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const addUnique = (arr: string[], item: string) => (arr.includes(item) ? arr : [...arr, item]);
  const removeItem = (arr: string[], item: string) => arr.filter((x) => x !== item);

  // Handlers
  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
    updateQuery({ priceBucket: value });
  };

  const handleAddFabric = (fabric: string) => {
    if (!fabric) return;
    const updated = addUnique(selectedFabrics, fabric);
    setSelectedFabrics(updated);
    setFabricToAdd("");
    updateQuery({ fabrics: updated });
  };

  const handleAddWork = (work: string) => {
    if (!work) return;
    const updated = addUnique(selectedWorks, work);
    setSelectedWorks(updated);
    setWorkToAdd("");
    updateQuery({ works: updated });
  };

  const handleTrendingToggle = () => {
    const nv = !trending;
    setTrending(nv);
    updateQuery({ trending: nv });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateQuery({ sort: value });
  };

  const handleSearchApply = () => {
    updateQuery({ search: search.trim() });
  };

  const clearAll = () => {
    setSelectedPrice(null);
    setSelectedFabrics([]);
    setSelectedWorks([]);
    setTrending(false);
    setSort("trending");
    setSearch("");
    setFabricToAdd("");
    setWorkToAdd("");
    router.push(pathname);
  };

  // Chips
  const chips: Chip[] = useMemo(() => {
    const list: Chip[] = [];

    if (search.trim()) list.push({ type: "search", label: `Search: ${search.trim()}`, value: search.trim() });

    if (selectedPrice) {
      const label = priceBuckets.find((p) => p.value === selectedPrice)?.label ?? selectedPrice;
      list.push({ type: "price", label: `Price: ${label}`, value: selectedPrice });
    }

    selectedFabrics.forEach((f) => list.push({ type: "fabric", label: `Fabric: ${f.replace(/-/g, " ")}`, value: f }));
    selectedWorks.forEach((w) => list.push({ type: "work", label: `Work: ${w.replace(/-/g, " ")}`, value: w }));

    if (trending) list.push({ type: "trending", label: "Trending only", value: "true" });

    return list;
  }, [search, selectedPrice, selectedFabrics, selectedWorks, trending]);

  const removeChip = (chip: Chip) => {
    if (chip.type === "search") {
      setSearch("");
      updateQuery({ search: "" });
      return;
    }
    if (chip.type === "price") {
      setSelectedPrice(null);
      updateQuery({ priceBucket: null });
      return;
    }
    if (chip.type === "fabric") {
      const updated = removeItem(selectedFabrics, chip.value);
      setSelectedFabrics(updated);
      updateQuery({ fabrics: updated });
      return;
    }
    if (chip.type === "work") {
      const updated = removeItem(selectedWorks, chip.value);
      setSelectedWorks(updated);
      updateQuery({ works: updated });
      return;
    }
    if (chip.type === "trending") {
      setTrending(false);
      updateQuery({ trending: false });
      return;
    }
  };

  return (
    <aside className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-primary">Filters</h3>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-semibold text-primary underline underline-offset-2"
        >
          Clear all
        </button>
      </div>

      {/* Active chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((c, idx) => (
            <span
              key={`${c.type}-${c.value}-${idx}`}
              className="inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-white/80 px-3 py-1 text-xs"
            >
              <span className="text-gray-800">{c.label}</span>
              <button
                type="button"
                onClick={() => removeChip(c)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                aria-label={`Remove ${c.label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-primary">
          Search
        </label>
        <div className="flex">
          <input
            id="search"
            className="flex-1 border border-secondary/30 rounded-l-xl px-3 py-2 text-sm bg-white/80 focus:outline-none"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSearchApply}
            className="rounded-r-xl bg-primary text-white px-4 text-sm font-semibold hover:opacity-90"
          >
            Go
          </button>
        </div>
      </div>

      {/* Price dropdown (single select) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Price</label>
        <select
          className="w-full border border-secondary/30 rounded-xl px-3 py-2 text-sm bg-white/80"
          value={selectedPrice ?? ""}
          onChange={(e) => handlePriceChange(e.target.value)}
        >
          <option value="">Select price range</option>
          {priceBuckets.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fabric dropdown (multi add) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Fabric</label>
        <div className="flex gap-2">
          <select
            className="flex-1 border border-secondary/30 rounded-xl px-3 py-2 text-sm bg-white/80 capitalize"
            value={fabricToAdd}
            onChange={(e) => {
              const v = e.target.value;
              setFabricToAdd(v);
              handleAddFabric(v);
            }}
          >
            <option value="">Add a fabric</option>
            {fabricCategories
              .filter((f) => !selectedFabrics.includes(f))
              .map((f) => (
                <option key={f} value={f}>
                  {f.replace(/-/g, " ")}
                </option>
              ))}
          </select>
        </div>
        <p className="text-[11px] text-gray-600">Selected fabrics appear above as chips.</p>
      </div>

      {/* Work dropdown (multi add) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Work</label>
        <div className="flex gap-2">
          <select
            className="flex-1 border border-secondary/30 rounded-xl px-3 py-2 text-sm bg-white/80 capitalize"
            value={workToAdd}
            onChange={(e) => {
              const v = e.target.value;
              setWorkToAdd(v);
              handleAddWork(v);
            }}
          >
            <option value="">Add a work type</option>
            {workCategories
              .filter((w) => !selectedWorks.includes(w))
              .map((w) => (
                <option key={w} value={w}>
                  {w.replace(/-/g, " ")}
                </option>
              ))}
          </select>
        </div>
        <p className="text-[11px] text-gray-600">Selected work types appear above as chips.</p>
      </div>

      {/* Trending toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={trending} onChange={handleTrendingToggle} />
        <span>Trending only</span>
      </label>

      {/* Sort dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Sort</label>
        <select
          className="w-full border border-secondary/30 rounded-xl px-3 py-2 text-sm bg-white/80"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
