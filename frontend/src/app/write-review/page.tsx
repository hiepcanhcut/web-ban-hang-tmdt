'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  reviewsCount: number;
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

export default function WriteReviewPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!productId) {
      router.push('/orders');
      return;
    }

    loadProduct();
    checkOrderEligibility();
  }, [productId, orderId, router]);

  const loadProduct = () => {
    try {
      // Load from admin products or sample data
      const adminProducts = localStorage.getItem('admin_products');
      const sampleProducts = localStorage.getItem('sample_products');

      let allProducts: Product[] = [];

      if (adminProducts) {
        allProducts = JSON.parse(adminProducts);
      } else if (sampleProducts) {
        allProducts = JSON.parse(sampleProducts);
      }

      const foundProduct = allProducts.find(p => p._id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkOrderEligibility = () => {
    try {
      if (!orderId) return;

      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        const order = orders.find((o: any) => o._id === orderId);

        if (!order || order.status !== 'delivered') {
          alert('You can only review products from delivered orders.');
          router.push('/orders');
          return;
        }

        // Check if user has already reviewed this product
        const reviewsData = localStorage.getItem('reviews');
        if (reviewsData) {
          const reviews: Review[] = JSON.parse(reviewsData);
          const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;
          const existingReview = reviews.find(r => r.productId === productId && r.userId === userEmail);

          if (existingReview) {
            alert('You have already reviewed this product.');
            router.push('/orders');
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error checking order eligibility:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      alert('Please fill in both title and review.');
      return;
    }

    setSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      const review: Review = {
        id: `review_${Date.now()}`,
        productId: productId!,
        userId: userData.email || 'anonymous',
        userName: userData.name || 'Anonymous User',
        rating,
        title: title.trim(),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        helpful: 0
      };

      // Save review to localStorage
      const reviewsData = localStorage.getItem('reviews');
      const reviews: Review[] = reviewsData ? JSON.parse(reviewsData) : [];
      reviews.push(review);
      localStorage.setItem('reviews', JSON.stringify(reviews));

      // Update product's average rating
      updateProductRating();

      alert('Thank you for your review!');
      router.push('/orders');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateProductRating = () => {
    try {
      const reviewsData = localStorage.getItem('reviews');
      if (reviewsData) {
        const reviews: Review[] = JSON.parse(reviewsData);
        const productReviews = reviews.filter(r => r.productId === productId);

        if (productReviews.length > 0) {
          const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

          // Update in admin products
          const adminProducts = localStorage.getItem('admin_products');
          if (adminProducts) {
            const products: Product[] = JSON.parse(adminProducts);
            const updatedProducts = products.map(p =>
              p._id === productId
                ? { ...p, rating: Number(averageRating.toFixed(1)), reviewsCount: productReviews.length }
                : p
            );
            localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
          }
        }
      }
    } catch (error) {
      console.error('Error updating product rating:', error);
    }
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
          <Link href="/orders" className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Write a Review</h1>
            <p className="text-text-secondary">Share your experience with this product</p>
          </div>

          {/* Product Info */}
          <div className="bg-surface rounded-lg shadow-soft p-6 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="font-semibold text-text-primary">{product.name}</h2>
                <p className="text-text-secondary">${product.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmitReview} className="bg-surface rounded-lg shadow-soft p-6">
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-3">
                Overall Rating *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-2xl focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <FaStar
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'text-accent'
                          : 'text-text-secondary/30'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-text-secondary">
                  {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                maxLength={100}
                required
              />
              <p className="text-xs text-text-secondary mt-1">{title.length}/100 characters</p>
            </div>

            {/* Review Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell others about your experience with this product..."
                rows={6}
                className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
                maxLength={1000}
                required
              />
              <p className="text-xs text-text-secondary mt-1">{comment.length}/1000 characters</p>
            </div>

            {/* Guidelines */}
            <div className="bg-bg rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-text-primary mb-2">Review Guidelines</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Be honest and constructive</li>
                <li>• Focus on your experience with the product</li>
                <li>• Avoid inappropriate language</li>
                <li>• Reviews cannot be edited once submitted</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="flex-1 bg-primary text-text-primary py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/orders')}
                className="px-6 py-3 border border-text-secondary/30 text-text-secondary rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
