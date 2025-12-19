'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    loadOrders();
  }, [router]);

  const loadOrders = () => {
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const allOrders = JSON.parse(ordersData);
        // Filter orders by current user's email (since we don't have user IDs in this demo)
        const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;
        const userOrders = allOrders.filter((order: Order) => order.customer.email === userEmail);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent/10 text-accent';
      case 'awaiting_payment':
        return 'bg-warning/10 text-warning';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-500';
      case 'delivered':
        return 'bg-success/10 text-success';
      case 'cancelled':
        return 'bg-error/10 text-error';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'awaiting_payment':
        return 'Chờ thanh toán';
      case 'processing':
        return 'Đang trung chuyển';
      case 'in_transit':
        return 'Đang trung chuyển';
      case 'shipped':
        return 'Đang vận chuyển';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Bị huỷ';
      default:
        return status;
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

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-text-primary">My Orders</h1>
            <Link
              href="/products"
              className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">No orders yet</h2>
              <p className="text-text-secondary mb-8">You haven't placed any orders yet.</p>
              <Link
                href="/products"
                className="bg-primary text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-surface rounded-lg shadow-soft p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">
                        Order #{order._id.split('_')[1]}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                      <p className="text-2xl font-bold text-text-primary">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item._id} className="flex items-center space-x-3 p-3 bg-bg rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center p-3 bg-bg rounded-lg">
                        <span className="text-sm text-text-secondary">
                          +{order.items.length - 3} more items
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-text-secondary/20">
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Payment Method</h4>
                      <p className="text-text-secondary text-sm">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Shipping Address</h4>
                      <p className="text-text-secondary text-sm">
                        {order.customer.address}<br />
                        {order.customer.district}, {order.customer.city}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Order Summary</h4>
                      <div className="text-sm text-text-secondary space-y-1">
                        <div className="flex justify-between">
                          <span>Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>${order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-text-primary pt-1 border-t border-text-secondary/20">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-text-secondary/20 mt-6">
                    <Link
                      href={`/order-confirmation?orderId=${order._id}`}
                      className="text-primary hover:text-primary/80 underline text-sm"
                    >
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <Link
                        href={`/write-review?productId=${order.items[0]?.product._id}&orderId=${order._id}`}
                        className="text-success hover:text-success/80 underline text-sm"
                      >
                        Write Review
                      </Link>
                    )}
                    {['pending', 'awaiting_payment'].includes(order.status) && (
                      <button className="text-error hover:text-error/80 underline text-sm">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
