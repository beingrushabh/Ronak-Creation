"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "./FilterSidebar";

function getActiveCount(sp: ReturnType<typeof useSearchParams>) {
  const price = sp.get("priceBucket");
  const fabrics = sp.get("fabrics");
  const works = sp.get("works");
  const trending = sp.get("trending") === "true";
  const search = (sp.get("search") ?? "").trim();

  let count = 0;
  if (search) count += 1;
  if (price) count += 1;
  if (fabrics) count += fabrics.split(",").filter(Boolean).length;
  if (works) count += works.split(",").filter(Boolean).length;
  if (trending) count += 1;
  return count;
}

export default function MobileFilterBar() {
  const [open, setOpen] = useState(false);
  const sp = useSearchParams();

  const activeCount = useMemo(() => getActiveCount(sp), [sp]);

  return (
    <>
      {/* Always stuck at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
        >
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      {/* IMPORTANT: padding so content isn't hidden behind the bar */}
      <div className="h-20 lg:hidden" />

      {/* Bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="font-semibold">Filters</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <FilterSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
