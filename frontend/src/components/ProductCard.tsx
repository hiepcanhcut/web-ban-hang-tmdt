'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist = false }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock > 0) {
      onAddToCart?.(product._id);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleWishlist?.(product._id);
  };

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div
      className="group relative bg-surface rounded-lg shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-bg">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-text-secondary/10 animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <div className="bg-primary text-text-primary px-2 py-1 rounded-full text-xs font-semibold">
                NEW
              </div>
            )}
            {product.isOnSale && discountPercentage > 0 && (
              <div className="bg-accent text-text-primary px-2 py-1 rounded-full text-xs font-semibold">
                -{discountPercentage}%
              </div>
            )}
            {product.stock === 0 && (
              <div className="bg-error text-text-primary px-2 py-1 rounded-full text-xs font-semibold">
                OUT OF STOCK
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 px-2 py-1 rounded-full transition-all duration-300 text-sm ${
              isInWishlist
                ? 'bg-error text-text-primary'
                : 'bg-surface/80 text-text-secondary hover:bg-primary hover:text-text-primary'
            }`}
          >
            {isInWishlist ? '♥' : '♡'}
          </button>

          {/* Overlay on Hover */}
          {isHovered && product.stock > 0 && (
            <div className="absolute inset-0 bg-primary/10 transition-opacity duration-300" />
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-accent text-sm">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="text-text-secondary text-sm ml-2">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              ${product.price.toLocaleString()}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-sm text-text-secondary line-through">
                ${product.salePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-3 py-2 rounded-full transition-all duration-300 transform text-sm font-medium ${
              product.stock === 0
                ? 'bg-text-secondary/30 text-text-secondary cursor-not-allowed'
                : 'bg-primary text-text-primary hover:bg-primary/80 hover:scale-110 shadow-soft'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
