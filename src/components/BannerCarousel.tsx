"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface Banner {
  id: string;
  image_url: string;
  name?: string | null;
}

interface BannerCarouselProps {
  banners: Banner[];
  intervalMs?: number; // default 1000
  heightPx?: number;   // default 100
}

export default function BannerCarousel({
  banners,
  intervalMs = 3000,
  heightPx = 300,
}: BannerCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = banners?.length ?? 0;
  const current = useMemo(() => (count > 0 ? banners[index % count] : null), [banners, count, index]);

  const next = () => setIndex((prev) => (prev + 1) % count);
  const prev = () => setIndex((prev) => (prev - 1 + count) % count);

  // Auto-scroll
  useEffect(() => {
    if (count <= 1) return;
    if (paused) return;

    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, intervalMs);

    return () => clearInterval(t);
  }, [count, intervalMs, paused]);

  if (!current) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-secondary/20 bg-white/60 shadow-sm"
      style={{ height: `${heightPx}px` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image */}
      <div className="relative h-full w-full">
        <Image
          src={current.image_url}
          alt={current.name || "Banner"}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        {/* subtle overlay so buttons look good on bright images */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
      </div>

      {/* Buttons centered vertically */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 hover:bg-white shadow border border-secondary/20"
            aria-label="Previous banner"
          >
            <span className="text-lg leading-none">‹</span>
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 hover:bg-white shadow border border-secondary/20"
            aria-label="Next banner"
          >
            <span className="text-lg leading-none">›</span>
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={
                  "h-2 w-2 rounded-full transition-all " +
                  (i === index ? "bg-secondary w-4" : "bg-white/80 hover:bg-white")
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
