import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

interface Product {
  id: string;
  heading: string;
  price: number;
  discount: number;
  trending: boolean | null;
  is_hidden: boolean | null;
}

async function getProducts(search?: string): Promise<Product[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(supabaseUrl, serviceKey);
  let query = supabase.from('products').select('id, heading, price, discount, trending, is_hidden').order('created_at', { ascending: false });
  if (search) {
    query = query.ilike('heading', `%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export default async function AdminProductsPage({ searchParams }: { searchParams: { search?: string } }) {
  const products = await getProducts(searchParams.search);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <form className="mb-4" method="get">
        <input
          type="text"
          name="search"
          defaultValue={searchParams.search || ''}
          placeholder="Search products…"
          className="border rounded p-2 text-sm w-64"
        />
        <button type="submit" className="ml-2 bg-primary text-white px-3 py-2 rounded text-sm">Search</button>
      </form>
      <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Heading</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Discount</th>
            <th className="px-4 py-2 text-left">Trending</th>
            <th className="px-4 py-2 text-left">Hidden</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2"><Link href={`/admin/products/${p.id}`} className="underline text-primary">{p.heading}</Link></td>
              <td className="px-4 py-2">₹{p.price}</td>
              <td className="px-4 py-2">{p.discount}%</td>
              <td className="px-4 py-2">{p.trending ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2">{p.is_hidden ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 text-right">
                <form action={`/api/admin/products/${p.id}/hide`} method="post" className="inline">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded text-sm bg-secondary text-white hover:bg-primary"
                  >
                    {p.is_hidden ? 'Unhide' : 'Hide'}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}