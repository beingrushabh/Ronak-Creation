"use client";

import { useState } from 'react';
import Image from 'next/image';

interface Banner {
  id: string;
  image_url: string;
  name?: string | null;
}

interface BannerCarouselProps {
  banners: Banner[];
}

/**
 * Simple banner carousel component. It cycles through banners
 * with left/right navigation. A more sophisticated carousel
 * could be introduced using a third‑party library if desired.
 */
export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [index, setIndex] = useState(0);
  if (!banners || banners.length === 0) return null;

  const next = () => setIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  const current = banners[index];

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md">
      <Image
        src={current.image_url}
        alt={current.name || 'Banner'}
        width={1200}
        height={400}
        className="w-full h-auto object-cover"
        priority
      />
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
            aria-label="Previous banner"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
            aria-label="Next banner"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}