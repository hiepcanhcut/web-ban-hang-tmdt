'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isOnSale?: boolean;
  isNew?: boolean;
  category: string;
  slug: string;
  description: string;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistItems?: string[];
}

const ProductGrid = ({
  products,
  loading = false,
  onAddToCart,
  onToggleWishlist,
  wishlistItems = []
}: ProductGridProps) => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = () => {
    setLoadingMore(true);
    // Simulate API call
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 8, products.length));
      setLoadingMore(false);
    }, 1000);
  };

  // Reset visible products when products change
  useEffect(() => {
    setVisibleProducts(8);
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-surface rounded-lg shadow-soft overflow-hidden animate-pulse">
            <div className="aspect-square bg-text-secondary/10"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-text-secondary/10 rounded"></div>
              <div className="h-4 bg-text-secondary/10 rounded w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-text-secondary/10 rounded w-20"></div>
                <div className="h-8 w-8 bg-text-secondary/10 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No products found</h3>
        <p className="text-text-secondary">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, visibleProducts).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={wishlistItems.includes(product._id)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {visibleProducts < products.length && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center px-6 py-3 bg-surface border border-text-secondary/30 text-text-secondary rounded-full hover:border-primary hover:text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                Load More Products
                <span className="ml-2">({products.length - visibleProducts} remaining)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-text-secondary text-sm">
        Showing {Math.min(visibleProducts, products.length)} of {products.length} products
      </div>
    </div>
  );
};

export default ProductGrid;
