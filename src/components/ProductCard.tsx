import Image from "next/image";
import Link from "next/link";

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

export default function ProductCard({
  product,
  variant = "default",
}: {
  product: ProductCardData;
  variant?: "default" | "trending";
}) {
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

  const chips = [
    fabric ? fabric.replace(/-/g, " ") : null,
    work ? work.replace(/-/g, " ") : null,
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/product/${id}`}
      className={
        "relative group block overflow-hidden rounded-2xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-all " +
        (variant === "trending" || trending ? "border-secondary/40 ring-1 ring-secondary/30" : "border-secondary/15")
      }
    >
      {(trending || variant === "trending") && (
        <span className="absolute z-10 top-3 left-3 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-black shadow-sm">
          ✨ Trending
        </span>
      )}

      {discount > 0 && (
        <span className="absolute z-10 top-3 right-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary border border-secondary/30">
          {discount}% OFF
        </span>
      )}

      <div className="relative pb-[130%]">
        <Image
          src={image_url || "https://placehold.co/300x400"}
          alt={heading}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[15px] md:text-base text-primary leading-snug min-h-[2.5rem]">
          {heading}
        </h3>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {chips.slice(0, 2).map((c) => (
              <span
                key={c}
                className="text-[11px] rounded-full px-2 py-0.5 bg-background border border-secondary/15 text-gray-700 capitalize"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">₹{computedPrice}</span>
          {discount > 0 && (
            <>
              <span className="text-sm line-through text-gray-500">₹{price}</span>
              <span className="text-xs font-semibold text-green-700">Save {discount}%</span>
            </>
          )}
        </div>

        <div className="text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
          {colour && (
            <span>
              <span className="font-medium text-gray-700">Colour:</span> {colour}
            </span>
          )}
          {stitch_type && (
            <span>
              <span className="font-medium text-gray-700">Stitch:</span> {stitch_type}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
