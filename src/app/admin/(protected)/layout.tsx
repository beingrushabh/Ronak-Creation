import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Base layout for all admin pages. Includes a sidebar with navigation
 * and wraps children with AdminGuard to enforce authentication.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-background">
        <aside className="w-56 bg-white border-r p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          </div>
          <nav className="space-y-2 text-sm">
            <Link href="/admin/dashboard" className="block py-1 hover:text-primary">Dashboard</Link>
            <Link href="/admin/products" className="block py-1 hover:text-primary">Products</Link>
            <Link href="/admin/products/new" className="block py-1 hover:text-primary pl-4">➜ Add Product</Link>
            <Link href="/admin/banners" className="block py-1 hover:text-primary">Banners</Link>
            <Link href="/admin/settings" className="block py-1 hover:text-primary">Settings</Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="mt-4 text-sm text-red-600 hover:underline">Logout</button>
            </form>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}