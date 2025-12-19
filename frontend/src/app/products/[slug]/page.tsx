'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

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

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      loadProduct();
      checkUserPurchase();
    }
  }, [slug]);

  useEffect(() => {
    if (product) {
      loadReviews();
    }
  }, [product]);

  const loadProduct = async () => {
    try {
      // Load from admin products first
      const adminProducts = localStorage.getItem('admin_products');
      if (adminProducts) {
        const products = JSON.parse(adminProducts);
        const foundProduct = products.find((p: Product) => p.slug === slug || p._id === slug);
        if (foundProduct) {
          setProduct(foundProduct);
          setLoading(false);
          return;
        }
      }

      // Fallback to sample products - try both slug and ID
      const sampleResponse = await fetch('/sample-products.json');
      const sampleData = await sampleResponse.json();
      const foundProduct = sampleData.products.find((p: Product) => p.slug === slug || p._id === slug);
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
        return;
      }

      // If still not found, try to find by partial match or create a placeholder
      if (adminProducts) {
        const products = JSON.parse(adminProducts);
        // Try to find by name similarity or any identifier
        const possibleProduct = products.find((p: Product) =>
          p.name.toLowerCase().includes(slug.toLowerCase()) ||
          slug.includes(p._id)
        );
        if (possibleProduct) {
          setProduct(possibleProduct);
          setLoading(false);
          return;
        }
      }

    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = () => {
    try {
      const reviewsData = localStorage.getItem('reviews');
      if (reviewsData && product) {
        const allReviews = JSON.parse(reviewsData);
        const productReviews = allReviews.filter((r: Review) => r.productId === product._id);
        setReviews(productReviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const checkUserPurchase = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData);
        setUser(user);

        // Check if user has purchased this product
        const ordersData = localStorage.getItem('orders');
        if (ordersData) {
          const orders = JSON.parse(ordersData);
          const userOrders = orders.filter((order: any) => order.customer.email === user.email);
          const hasPurchasedProduct = userOrders.some((order: any) =>
            order.items.some((item: any) => item.product.slug === slug) && order.status === 'delivered'
          );
          setHasPurchased(hasPurchasedProduct);
        }
      }
    } catch (error) {
      console.error('Error checking purchase:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const existingCart = localStorage.getItem('cart');
    let cartItems = [];

    if (existingCart) {
      try {
        cartItems = JSON.parse(existingCart);
      } catch (error) {
        cartItems = [];
      }
    }

    // Check if product already in cart
    const existingItem = cartItems.find((item: any) => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
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

    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert(`${product.name} added to cart!`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewRating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      alert('Please fill in both title and comment');
      return;
    }

    const review: Review = {
      id: `review_${Date.now()}`,
      productId: product?._id || slug,
      userId: user.email,
      userName: user.name,
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
      helpful: 0
    };

    // Save review with error handling
    try {
      const reviewsData = localStorage.getItem('reviews') || '[]';
      const allReviews = JSON.parse(reviewsData);
      allReviews.push(review);
      localStorage.setItem('reviews', JSON.stringify(allReviews));
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Error saving review. Please try again.');
      return;
    }

    // Update product rating
    updateProductRating();

    // Reset form and reload
    setReviewRating(0);
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    loadReviews();

    alert('Review submitted successfully!');
  };

  const updateProductRating = () => {
    try {
      const reviewsData = localStorage.getItem('reviews');
      if (reviewsData) {
        const allReviews = JSON.parse(reviewsData);
        const productReviews = allReviews.filter((r: Review) => r.productId === slug);

        if (productReviews.length > 0) {
          const averageRating = productReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / productReviews.length;

          // Update in admin products
          const adminProducts = localStorage.getItem('admin_products');
          if (adminProducts && product) {
            const products: Product[] = JSON.parse(adminProducts);
            const updatedProducts = products.map(p =>
              p._id === product._id
                ? { ...p, rating: Number(averageRating.toFixed(1)), reviewsCount: productReviews.length }
                : p
            );
            localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
            setProduct(updatedProducts.find(p => p._id === product._id) || product);
          }
        }
      }
    } catch (error) {
      console.error('Error updating product rating:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              if (interactive && onRate) {
                onRate(star);
              }
            }}
            className={`text-xl transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110 hover:text-accent' : 'cursor-default'
            } ${
              star <= rating
                ? 'text-accent'
                : 'text-text-secondary/30'
            }`}
            disabled={!interactive}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Product Not Found</h2>
          <Link href="/products" className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-text-secondary mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-surface rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    {renderStars(product.rating)}
                    <span className="text-text-secondary">({product.reviewsCount} reviews)</span>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="text-xl text-text-secondary line-through">
                      ${product.salePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-2">Description</h3>
                <p className="text-text-secondary leading-relaxed">{product.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  product.stock > 10
                    ? 'bg-success/10 text-success'
                    : product.stock > 0
                    ? 'bg-accent/10 text-accent'
                    : 'bg-error/10 text-error'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-primary text-text-primary py-4 rounded-lg font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 border-t border-text-secondary/20 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text-primary">Customer Reviews</h2>
              {user && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
                >
                  Write a Review
                </button>
              )}
              {!user && (
                <Link
                  href="/login"
                  className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
                >
                  Login to Review
                </Link>
              )}
            </div>

            {/* Purchase Notice */}
            {user && !hasPurchased && !showReviewForm && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
                <p className="text-accent text-sm">
                  💡 <strong>Tip:</strong> Purchase this product to write a review and help other customers!
                </p>
              </div>
            )}

            {/* Write Review Form */}
            {showReviewForm && user && (
              <div className="bg-surface rounded-lg shadow-soft p-6 mb-8">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Write Your Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Rating *</label>
                    {renderStars(reviewRating, true, (rating: number) => setReviewRating(rating))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Review Title *</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Summarize your experience"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Your Review *</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
                      placeholder="Share your experience with this product..."
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="border border-text-secondary/30 text-text-secondary px-6 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-text-secondary">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-surface rounded-lg shadow-soft p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-text-secondary">by {review.userName}</span>
                        </div>
                        <h4 className="font-semibold text-text-primary">{review.title}</h4>
                      </div>
                      <span className="text-sm text-text-secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
