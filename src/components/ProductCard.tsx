import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardData {
  id: string;
  heading: string;
  price: number;
  discount: number;
  final_price?: number;
  fabric?: string | null;
  work?: string | null;
  colour?: string | null;
  stitch_type?: string | null;
  image_url?: string | null;
  trending?: boolean | null;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const {
    id,
    heading,
    price,
    discount,
    final_price,
    fabric,
    work,
    colour,
    stitch_type,
    image_url,
    trending,
  } = product;

  const computedPrice = final_price ?? Math.round(price - (discount * price) / 100);

  return (
    <Link href={`/product/${id}`} className="block border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow bg-white relative">
      {trending && (
        <span className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 text-xs rounded">
          Trending
        </span>
      )}
      <div className="relative pb-[130%]">
        <Image
          src={image_url || 'https://placehold.co/300x400'}
          alt={heading}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-lg text-primary line-clamp-2 min-h-[3rem]">{heading}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-lg font-bold text-primary">₹{computedPrice}</span>
          {discount > 0 && (
            <>
              <span className="text-sm line-through text-gray-500">₹{price}</span>
              <span className="text-xs text-green-700">-{discount}%</span>
            </>
          )}
        </div>
        <ul className="text-xs text-gray-600 space-y-0.5">
          {fabric && <li><strong>Fabric:</strong> {fabric}</li>}
          {work && <li><strong>Work:</strong> {work}</li>}
          {colour && <li><strong>Colour:</strong> {colour}</li>}
          {stitch_type && <li><strong>Stitch:</strong> {stitch_type}</li>}
        </ul>
      </div>
    </Link>
  );
}