import { ProductCardData } from "./ProductCard";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  variant = "default",
}: {
  products: ProductCardData[];
  variant?: "default" | "trending";
}) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }

  if (variant === "trending") {
    return (
      <div className="-mx-2 overflow-x-auto pb-2">
        <div className="flex gap-4 px-1 snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product.id} className="min-w-[220px] max-w-[220px] snap-start">
              <ProductCard product={product} variant="trending" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
