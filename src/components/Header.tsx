"use client";

import Link from 'next/link';

/**
 * Header component displayed on all public pages.
 */
export default function Header() {
  return (
    <header className="p-4 bg-background shadow flex items-center justify-between border-b border-secondary/30">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-primary">Ronak Creation</h1>
        <span className="text-sm italic text-gray-700">Manufacturers of fancy lehenga</span>
      </div>
      <div className="flex space-x-4">
        {/* Replace numbers with your real contact details */}
        <Link href="https://wa.me/919876543210" className="text-primary underline">
          WhatsApp
        </Link>
        <Link href="tel:919876543210" className="text-primary underline">
          Call Us
        </Link>
      </div>
    </header>
  );
}