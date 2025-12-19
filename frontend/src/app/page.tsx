'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';

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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    // First, immediately load from localStorage or sample data
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

    // If no admin products, load sample data
    if (allProducts.length === 0) {
      try {
        const sampleResponse = await fetch('/sample-products.json');
        const sampleData = await sampleResponse.json();
        allProducts = sampleData.products;
      } catch (sampleError) {
        console.error('Error loading sample data:', sampleError);
        setFeaturedProducts([]);
        setLoading(false);
        return;
      }
    }

    // Sort products to prioritize high-value items for featured section
    const sortedProducts = allProducts.sort((a, b) => {
      // Priority 1: New products first
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;

      // Priority 2: Sale products next
      if (a.isOnSale && !b.isOnSale) return -1;
      if (!a.isOnSale && b.isOnSale) return 1;

      // Priority 3: Higher price first (premium products)
      return b.price - a.price;
    });

    // Take top 8 featured products
    setFeaturedProducts(sortedProducts.slice(0, 8));
    setLoading(false);

    // In background, try to fetch from API (non-blocking)
    fetchFromAPI();
  };

  const fetchFromAPI = async () => {
    try {
      // Set timeout to avoid long waits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      const response = await fetch('http://localhost:5000/api/products?limit=8', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (data.products && data.products.length > 0) {
        setFeaturedProducts(data.products);
      }
    } catch (error) {
      // API failed, keep current products (sample data)
      console.log('API not available, using local data');
    }
  };

  const handleAddToCart = async (productId: string) => {
    // Find the product
    const product = featuredProducts.find(p => p._id === productId);
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
        size: 'M', // Default size
        color: 'Default' // Default color
      });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Show success message
    alert(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = async (productId: string) => {
    // Get existing wishlist from localStorage
    const existingWishlist = localStorage.getItem('wishlist');
    let wishlistItems = [];

    if (existingWishlist) {
      try {
        wishlistItems = JSON.parse(existingWishlist);
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        wishlistItems = [];
      }
    }

    // Check if product is already in wishlist
    const isInWishlist = wishlistItems.includes(productId);

    if (isInWishlist) {
      // Remove from wishlist
      wishlistItems = wishlistItems.filter((id: string) => id !== productId);
    } else {
      // Add to wishlist
      wishlistItems.push(productId);
    }

    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Trust Badges Section */}
      <section className="py-12 bg-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-surface p-4 rounded-lg shadow-soft hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-success mb-1">100%</div>
              <div className="text-sm text-text-secondary">Genuine Products</div>
            </div>
            <div className="bg-surface p-4 rounded-lg shadow-soft hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-primary mb-1">Free</div>
              <div className="text-sm text-text-secondary">Shipping $50+</div>
            </div>
            <div className="bg-surface p-4 rounded-lg shadow-soft hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-accent mb-1">200%</div>
              <div className="text-sm text-text-secondary">Refund if Fake</div>
            </div>
            <div className="bg-surface p-4 rounded-lg shadow-soft hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-primary mb-1">30</div>
              <div className="text-sm text-text-secondary">Day Returns</div>
            </div>
          </div>
        </div>
      </section>



      {/* Categories Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-primary">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Electronics',
              'Fashion',
              'Home & Living',
              'Sports & Outdoors',
              'Books',
              'Beauty',
              'Automotive',
              'Toys & Games'
            ].map((category) => (
              <a
                key={category}
                href={`/products?category=${category.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')}`}
                className="bg-bg hover:bg-bg/80 p-6 rounded-lg shadow-soft hover:shadow-lg transition-all duration-300 text-center group"
              >
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {category}
                </h3>
                <div className="text-sm text-text-secondary mt-2 group-hover:text-primary transition-colors">
                  Explore →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-text-primary">Featured Products</h2>
            <p className="text-xl text-text-secondary">Discover our handpicked selection</p>
          </div>

          <ProductGrid
            products={featuredProducts}
            loading={loading}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">Stay Updated</h2>
          <p className="text-xl mb-8 text-text-secondary max-w-2xl mx-auto">
            Subscribe to get exclusive deals and latest product updates
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-text-secondary">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">500+</div>
              <div className="text-text-secondary">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">4.9</div>
              <div className="text-text-secondary">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-text-secondary">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
