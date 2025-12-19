'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrder = (id: string) => {
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        const foundOrder = orders.find((o: Order) => o._id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Order Not Found</h2>
          <p className="text-text-secondary mb-8">The order you're looking for doesn't exist.</p>
          <Link href="/" className="bg-primary text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-success mb-2">Order Confirmed!</h1>
            <p className="text-xl text-text-secondary">Thank you for your purchase</p>
            <p className="text-text-secondary mt-2">Order #{order._id.split('_')[1]}</p>
          </div>

          {/* Order Status */}
          <div className="bg-surface rounded-lg shadow-soft p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">Order Status</h2>
                <p className="text-text-secondary">
                  Status: <span className={`font-semibold ${
                    order.status === 'pending' ? 'text-accent' :
                    order.status === 'awaiting_payment' ? 'text-warning' :
                    'text-success'
                  }`}>
                    {order.status === 'pending' ? 'Pending Delivery' :
                     order.status === 'awaiting_payment' ? 'Awaiting Payment' :
                     order.status}
                  </span>
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Order Date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="text-right">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  order.status === 'pending' ? 'bg-accent/10 text-accent' :
                  order.status === 'awaiting_payment' ? 'bg-warning/10 text-warning' :
                  'bg-success/10 text-success'
                }`}>
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div className="bg-surface rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Order Items</h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 bg-bg rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary">{item.product.name}</h3>
                      <p className="text-sm text-text-secondary">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-text-secondary">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-4 border-t border-text-secondary/20">
                <div className="space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-text-primary text-lg pt-2 border-t border-text-secondary/20">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Customer Information</h2>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-text-secondary">Name:</span>
                    <p className="text-text-primary">{order.customer.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-text-secondary">Email:</span>
                    <p className="text-text-primary">{order.customer.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-text-secondary">Phone:</span>
                    <p className="text-text-primary">{order.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Shipping Address</h2>

                <div className="space-y-1">
                  <p className="text-text-primary">{order.customer.address}</p>
                  <p className="text-text-primary">{order.customer.district}</p>
                  <p className="text-text-primary">{order.customer.city}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Information</h2>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-text-secondary">Method:</span>
                    <p className="text-text-primary">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}
                    </p>
                  </div>

                  {order.paymentMethod === 'bank' && (
                    <div className="mt-4 p-4 bg-bg rounded-lg">
                      <p className="text-sm text-text-secondary mb-2">
                        Please transfer the exact amount to the following account:
                      </p>
                      <div className="text-sm space-y-1">
                        <p><strong>Bank:</strong> Vietcombank</p>
                        <p><strong>Account:</strong> 1234567890</p>
                        <p><strong>Name:</strong> E-Shop Company</p>
                        <p><strong>Amount:</strong> ${order.total.toFixed(2)}</p>
                        <p><strong>Note:</strong> Order #{order._id.split('_')[1]}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="font-medium text-text-secondary">Status:</span>
                    <p className={`font-semibold ${
                      order.status === 'pending' ? 'text-accent' :
                      order.status === 'awaiting_payment' ? 'text-warning' :
                      'text-success'
                    }`}>
                      {order.status === 'pending' ? 'Payment on Delivery' :
                       order.status === 'awaiting_payment' ? 'Awaiting Bank Transfer' :
                       order.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">What's Next?</h2>

                <div className="space-y-3">
                  {order.paymentMethod === 'cod' ? (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-text-primary text-sm font-bold mt-0.5">1</div>
                        <div>
                          <p className="font-medium text-text-primary">Order Processing</p>
                          <p className="text-sm text-text-secondary">We'll prepare your order for delivery within 1-2 business days.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-text-primary text-sm font-bold mt-0.5">2</div>
                        <div>
                          <p className="font-medium text-text-primary">Shipping</p>
                          <p className="text-sm text-text-secondary">Your order will be delivered to your address within 3-5 business days.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-text-primary text-sm font-bold mt-0.5">3</div>
                        <div>
                          <p className="font-medium text-text-primary">Cash on Delivery</p>
                          <p className="text-sm text-text-secondary">Pay the delivery person when you receive your order.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center text-text-primary text-sm font-bold mt-0.5">1</div>
                        <div>
                          <p className="font-medium text-text-primary">Bank Transfer</p>
                          <p className="text-sm text-text-secondary">Transfer the exact amount using the bank details above.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-text-primary text-sm font-bold mt-0.5">2</div>
                        <div>
                          <p className="font-medium text-text-primary">Payment Confirmation</p>
                          <p className="text-sm text-text-secondary">We'll confirm your payment and process your order.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-text-primary text-sm font-bold mt-0.5">3</div>
                        <div>
                          <p className="font-medium text-text-primary">Shipping</p>
                          <p className="text-sm text-text-secondary">Your order will be delivered within 3-5 business days.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Link
                  href="/products"
                  className="flex-1 bg-primary text-text-primary py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors text-center"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="flex-1 border border-text-secondary/30 text-text-secondary py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
