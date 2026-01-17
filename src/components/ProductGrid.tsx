import { ProductCardData } from './ProductCard';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ProductCardData[];
}

/**
 * Displays products in a responsive grid. Pass an empty array to
 * display an empty state message.
 */
export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}