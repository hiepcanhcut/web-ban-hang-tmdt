'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  rating: number;
  reviewsCount: number;
  category: string;
  slug: string;
  stock: number;
  isOnSale?: boolean;
  isNew?: boolean;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      // First check if admin has added products in localStorage
      const adminProducts = localStorage.getItem('admin_products');
      let allProducts: Product[] = [];

      if (adminProducts) {
        try {
          const parsedAdminProducts = JSON.parse(adminProducts);
          allProducts = parsedAdminProducts;
        } catch (error) {
          console.error('Error parsing admin products:', error);
        }
      }

      // Try to fetch from API as well (merge with admin products)
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('keyword', searchTerm);
        if (selectedCategory) params.append('category', selectedCategory);

        const response = await fetch(`http://localhost:5000/api/products?${params}`, { signal: AbortSignal.timeout(2000) });
        if (response.ok) {
          const data = await response.json();
          // Merge API products with admin products (avoid duplicates)
          const apiProducts = data.products || [];
          const combinedProducts = [...allProducts];

          apiProducts.forEach((apiProduct: Product) => {
            if (!combinedProducts.find(p => p._id === apiProduct._id)) {
              combinedProducts.push(apiProduct);
            }
          });

          allProducts = combinedProducts;
        }
      } catch (apiError) {
        console.log('API not available, using local products only');
      }

      // Apply filters
      let filteredProducts = allProducts;

      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];

  const handleAddToCart = async (productId: string) => {
    // Find the product
    const product = products.find(p => p._id === productId);
    if (!product) return;

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cartItems = [];

    if (existingCart) {
      try {
        cartItems = JSON.parse(existingCart);
      } catch (error) {
        console.error('Error parsing cart:', error);
        cartItems = [];
      }
    }

    // Check if product already in cart
    const existingItem = cartItems.find((item: any) => item.product._id === productId);

    if (existingItem) {
      // Increase quantity
      existingItem.quantity += 1;
    } else {
      // Add new item
      cartItems.push({
        _id: `cart_${Date.now()}_${Math.random()}`,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        },
        quantity: 1,
        size: 'M',
        color: 'Default'
      });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Show success message
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Our Products</h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-surface border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-surface border border-text-secondary/30 rounded-lg text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">No products found</h3>
            <p className="text-text-secondary mb-6">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="bg-primary text-text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/80 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="group relative bg-surface rounded-lg shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-bg">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />

                    {/* Loading Skeleton */}
                    {!product.images[0] && (
                      <div className="absolute inset-0 bg-text-secondary/10 animate-pulse" />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <div className="bg-primary text-text-primary px-2 py-1 rounded-full text-xs font-semibold">
                          NEW
                        </div>
                      )}
                      {product.isOnSale && product.salePrice && (
                        <div className="bg-accent text-text-primary px-2 py-1 rounded-full text-xs font-semibold">
                          SALE
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
                      onClick={() => {/* wishlist logic */}}
                      className="absolute top-3 right-3 px-2 py-1 rounded-full transition-all duration-300 text-sm bg-surface/80 text-text-secondary hover:bg-primary hover:text-text-primary"
                    >
                      ♡
                    </button>

                    {/* Overlay on Hover */}
                    {product.stock > 0 && (
                      <div className="absolute inset-0 bg-primary/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
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
                  <div className="flex items-center justify-between mb-4">
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
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className={`w-full px-3 py-2 rounded-full transition-all duration-300 transform text-sm font-medium ${
                      product.stock === 0
                        ? 'bg-text-secondary/30 text-text-secondary cursor-not-allowed'
                        : 'bg-primary text-text-primary hover:bg-primary/80 hover:scale-105 shadow-soft'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
