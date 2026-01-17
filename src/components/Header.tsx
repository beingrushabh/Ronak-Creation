"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-secondary/20 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary">
            Ronak Creation
          </h1>
          <span className="text-sm text-gray-700">Manufacturers of fancy lehenga</span>
        </div>

        {/* change these numbers */}
        <div className="flex items-center gap-2">
          <Link
            href="https://wa.me/919876543210"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-black shadow-sm hover:opacity-90"
          >
            WhatsApp
          </Link>
          <Link
            href="tel:919876543210"
            className="inline-flex items-center justify-center rounded-full border border-secondary/40 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-white"
          >
            Call
          </Link>
        </div>
      </div>
    </header>
  );
}
