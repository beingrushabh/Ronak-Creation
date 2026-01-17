import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_hidden', false)
    .single();
  if (error) {
    return null;
  }
  return data;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const finalPrice = product.final_price ?? Math.round(product.price - (product.discount * product.price) / 100);
  const whatsappMsg = encodeURIComponent(
    `Hello, I'm interested in the product "${product.heading}" priced at ₹${finalPrice}. Please provide more details.`
  );
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMsg}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative w-full pb-[130%] rounded overflow-hidden shadow">
          <Image
            src={product.image_url || 'https://placehold.co/600x800'}
            alt={product.heading}
            fill
            className="object-cover"
            priority
          />
        </div>
        {product.available_colours_hex && product.available_colours_hex.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Available Colours</h3>
            <div className="flex flex-wrap gap-2">
              {product.available_colours_hex.map((hex: string) => (
                <span key={hex} className="w-6 h-6 rounded-full border" style={{ backgroundColor: hex }} title={hex} />
              ))}
            </div>
          </div>
        )}
        <Link
          href={whatsappUrl}
          className="inline-block bg-primary text-white px-4 py-2 rounded text-sm text-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire on WhatsApp
        </Link>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary">{product.heading}</h1>
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-primary">₹{finalPrice}</span>
          {product.discount > 0 && (
            <>
              <span className="text-lg line-through text-gray-500">₹{product.price}</span>
              <span className="text-sm text-green-700">-{product.discount}%</span>
            </>
          )}
        </div>
        <table className="text-sm w-full">
          <tbody className="divide-y divide-gray-200">
            {product.measurement && (
              <tr>
                <td className="py-2 font-medium w-40">Measurement</td>
                <td className="py-2">{product.measurement}</td>
              </tr>
            )}
            {product.fabric && (
              <tr>
                <td className="py-2 font-medium w-40">Fabric</td>
                <td className="py-2">{product.fabric}</td>
              </tr>
            )}
            {product.work && (
              <tr>
                <td className="py-2 font-medium w-40">Work</td>
                <td className="py-2">{product.work}</td>
              </tr>
            )}
            {product.colour && (
              <tr>
                <td className="py-2 font-medium w-40">Colour</td>
                <td className="py-2">{product.colour}</td>
              </tr>
            )}
            {product.stitch_type && (
              <tr>
                <td className="py-2 font-medium w-40">Stitch Type</td>
                <td className="py-2">{product.stitch_type}</td>
              </tr>
            )}
            {product.care_guide && (
              <tr>
                <td className="py-2 font-medium w-40">Care Guide</td>
                <td className="py-2">{product.care_guide}</td>
              </tr>
            )}
            {product.no_of_pieces !== null && product.no_of_pieces !== undefined && (
              <tr>
                <td className="py-2 font-medium w-40">No. of Pieces</td>
                <td className="py-2">{product.no_of_pieces}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}