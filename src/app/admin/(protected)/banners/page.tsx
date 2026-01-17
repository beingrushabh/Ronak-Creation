import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

interface Banner {
  id: string;
  name: string | null;
  image_url: string;
  is_active: boolean | null;
  sort_order: number | null;
}

async function getBanners(): Promise<Banner[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase.from('banners').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export default async function BannersPage() {
  const banners = await getBanners();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Banners</h1>
      <Link href="/admin/banners/new" className="inline-block bg-primary text-white px-3 py-2 rounded text-sm">Add Banner</Link>
      <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Image</th>
            <th className="px-4 py-2 text-left">Active</th>
            <th className="px-4 py-2 text-left">Order</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {banners.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="px-4 py-2">{b.name}</td>
              <td className="px-4 py-2">
                <img src={b.image_url} alt={b.name || ''} className="w-32 h-auto rounded" />
              </td>
              <td className="px-4 py-2">{b.is_active ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2">{b.sort_order}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <form action={`/api/admin/banners/${b.id}/toggle`} method="post" className="inline">
                  <button type="submit" className="bg-secondary text-white px-3 py-1 rounded text-sm">
                    {b.is_active ? 'Disable' : 'Enable'}
                  </button>
                </form>
                <form action={`/api/admin/banners/${b.id}`} method="post" className="inline">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}