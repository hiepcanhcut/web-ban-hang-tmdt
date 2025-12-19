'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaCheck, FaPen } from 'react-icons/fa';

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
  };
  items: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
      slug: string;
    };
    quantity: number;
    size: string;
    color: string;
  }>;
  paymentMethod: 'cod' | 'bank';
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  createdAt: string;
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

export default function WriteReviewsPage() {
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [existingReviews, setExistingReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Load delivered orders for this user
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const allOrders = JSON.parse(ordersData);
        const userDeliveredOrders = allOrders.filter((order: Order) =>
          order.customer.email === parsedUser.email && order.status === 'delivered'
        );
        setDeliveredOrders(userDeliveredOrders);
      }

      // Load existing reviews
      const reviewsData = localStorage.getItem('reviews');
      if (reviewsData) {
        const allReviews = JSON.parse(reviewsData);
        setExistingReviews(allReviews.filter((r: Review) => r.userId === parsedUser.email));
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const getReviewableProducts = () => {
    const reviewableProducts: Array<{
      product: any;
      orderId: string;
      orderDate: string;
      hasReviewed: boolean;
      existingReview?: Review;
    }> = [];

    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        const existingReview = existingReviews.find(r =>
          r.productId === item.product._id && r.userId === user.email
        );

        reviewableProducts.push({
          product: item.product,
          orderId: order._id,
          orderDate: order.createdAt,
          hasReviewed: !!existingReview,
          existingReview: existingReview
        });
      });
    });

    return reviewableProducts;
  };

  const getReviewStatus = (product: any) => {
    const review = existingReviews.find(r =>
      r.productId === product._id && r.userId === user.email
    );

    if (review) {
      return {
        status: 'reviewed',
        text: 'Đã đánh giá',
        icon: <FaCheck className="text-success" />,
        review: review
      };
    } else {
      return {
        status: 'pending',
        text: 'Chưa đánh giá',
        icon: <FaPen className="text-accent" />,
        review: null
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const reviewableProducts = getReviewableProducts();
  const reviewedCount = reviewableProducts.filter(p => p.hasReviewed).length;
  const pendingCount = reviewableProducts.filter(p => !p.hasReviewed).length;

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Viết đánh giá sản phẩm</h1>
            <p className="text-text-secondary">Đánh giá các sản phẩm bạn đã mua để giúp người khác có quyết định tốt hơn</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-lg shadow-soft text-center">
              <div className="text-3xl font-bold text-primary mb-2">{reviewableProducts.length}</div>
              <p className="text-text-secondary">Sản phẩm có thể đánh giá</p>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-soft text-center">
              <div className="text-3xl font-bold text-success mb-2">{reviewedCount}</div>
              <p className="text-text-secondary">Đã đánh giá</p>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-soft text-center">
              <div className="text-3xl font-bold text-accent mb-2">{pendingCount}</div>
              <p className="text-text-secondary">Chưa đánh giá</p>
            </div>
          </div>

          {/* Products List */}
          {reviewableProducts.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-soft p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Chưa có sản phẩm để đánh giá</h3>
              <p className="text-text-secondary mb-8">
                Bạn chưa có đơn hàng nào được giao thành công. Hãy mua sắm và trải nghiệm sản phẩm để có thể đánh giá!
              </p>
              <Link
                href="/products"
                className="bg-primary text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
              >
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Reviews */}
              {pendingCount > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Chưa đánh giá ({pendingCount})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviewableProducts
                      .filter(p => !p.hasReviewed)
                      .map((item) => {
                        const reviewStatus = getReviewStatus(item.product);
                        return (
                          <div key={`${item.orderId}-${item.product._id}`} className="bg-surface rounded-lg shadow-soft p-6">
                            <div className="flex items-start space-x-4 mb-4">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.product._id}`}
                                  className="font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-sm text-text-secondary mt-1">
                                  Đặt ngày: {new Date(item.orderDate).toLocaleDateString('vi-VN')}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  Giá: ${item.product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {reviewStatus.icon}
                                <span className="text-sm text-text-secondary">{reviewStatus.text}</span>
                              </div>
                              <Link
                                href={`/products/${item.product._id}`}
                                className="bg-primary text-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors text-sm"
                              >
                                Viết đánh giá
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Reviewed Products */}
              {reviewedCount > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Đã đánh giá ({reviewedCount})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviewableProducts
                      .filter(p => p.hasReviewed)
                      .map((item) => {
                        const reviewStatus = getReviewStatus(item.product);
                        return (
                          <div key={`${item.orderId}-${item.product._id}`} className="bg-surface rounded-lg shadow-soft p-6 border border-success/20">
                            <div className="flex items-start space-x-4 mb-4">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  className="font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-sm text-text-secondary mt-1">
                                  Đặt ngày: {new Date(item.orderDate).toLocaleDateString('vi-VN')}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  Giá: ${item.product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Review Summary */}
                            {reviewStatus.review && (
                              <div className="bg-bg rounded-lg p-3 mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="flex text-accent">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={i < reviewStatus.review!.rating ? 'text-accent' : 'text-text-secondary/30'}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-text-secondary">
                                    {new Date(reviewStatus.review!.createdAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                                <h4 className="font-medium text-text-primary text-sm mb-1">{reviewStatus.review!.title}</h4>
                                <p className="text-sm text-text-secondary line-clamp-2">{reviewStatus.review!.comment}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {reviewStatus.icon}
                                <span className="text-sm text-success font-medium">{reviewStatus.text}</span>
                              </div>
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="text-primary hover:text-primary/80 underline text-sm"
                              >
                                Xem sản phẩm
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 bg-surface rounded-lg shadow-soft p-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Hướng dẫn đánh giá</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-text-primary mb-2">✅ Có thể đánh giá khi:</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Đã mua và nhận hàng thành công</li>
                  <li>• Đơn hàng có status "Đã giao"</li>
                  <li>• Chưa từng đánh giá sản phẩm này</li>
                  <li>• Đăng nhập với tài khoản đã mua</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-2">📝 Cách đánh giá:</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Click "Viết đánh giá" trên sản phẩm</li>
                  <li>• Chọn số sao (1-5) cho trải nghiệm</li>
                  <li>• Viết tiêu đề và nội dung chi tiết</li>
                  <li>• Submit để hoàn thành đánh giá</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
