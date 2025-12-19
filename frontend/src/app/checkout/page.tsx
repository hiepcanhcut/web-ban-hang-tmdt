'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
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
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCart();
    loadUserInfo();
  }, []);

  const loadCart = () => {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        setCartItems(items);
      } else {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      router.push('/cart');
    }
  };

  const loadUserInfo = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData);
        // Auto-populate customer info from user profile
        setCustomerInfo({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          district: user.district || ''
        });
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone ||
        !customerInfo.address || !customerInfo.city || !customerInfo.district) {
      alert('Please fill in all required fields');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    // Create order object
    const order = {
      _id: `order_${Date.now()}`,
      customer: customerInfo,
      items: cartItems,
      paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'awaiting_payment',
      total: subtotal + shipping + tax,
      subtotal,
      shipping,
      tax,
      createdAt: new Date().toISOString()
    };

    // Reduce inventory for ordered items
    const adminProducts = localStorage.getItem('admin_products');
    if (adminProducts) {
      const products = JSON.parse(adminProducts);
      cartItems.forEach(cartItem => {
        const productIndex = products.findIndex((p: any) => p._id === cartItem.product._id);
        if (productIndex !== -1 && products[productIndex].stock >= cartItem.quantity) {
          products[productIndex].stock -= cartItem.quantity;
        }
      });
      localStorage.setItem('admin_products', JSON.stringify(products));
    }

    // Save order to localStorage (simulate database) with aggressive storage management
    try {
      const existingOrders = localStorage.getItem('orders');
      let orders = existingOrders ? JSON.parse(existingOrders) : [];

      // Keep only the most recent 5 orders to prevent quota exceeded
      if (orders.length >= 5) {
        orders = orders.slice(-4); // Keep last 4, will add 1 more
      }

      orders.push(order);

      // Try to save with minimal data approach
      try {
        localStorage.setItem('orders', JSON.stringify(orders));
      } catch (quotaError) {
        // If quota exceeded, clear all and keep only current order
        console.warn('Storage quota exceeded, clearing old orders');
        localStorage.removeItem('orders');
        localStorage.setItem('orders', JSON.stringify([order]));
        alert('Storage limit reached. Previous orders have been cleared to save your current order.');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order. Please try again.');
      setLoading(false);
      return;
    }

    // Clear cart
    localStorage.removeItem('cart');

    setLoading(false);

    // Redirect to order confirmation
    router.push(`/order-confirmation?orderId=${order._id}`);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Your cart is empty</h2>
          <Link href="/" className="bg-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
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
                        <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-text-secondary/20 pt-4 space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-text-primary text-lg pt-2 border-t border-text-secondary/20">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information & Payment */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Customer Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Enter your city"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={customerInfo.district}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Enter your district"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Enter your full address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Method</h2>

                <div className="space-y-4">
                  {/* COD Option */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-text-secondary/30 hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-primary"
                      />
                      <div>
                        <h3 className="font-semibold text-text-primary">Cash on Delivery (COD)</h3>
                        <p className="text-sm text-text-secondary">Pay when you receive the goods</p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer Option */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-primary bg-primary/5'
                        : 'border-text-secondary/30 hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="text-primary"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary">Bank Transfer (QR Code)</h3>
                        <p className="text-sm text-text-secondary">Scan QR code to pay via mobile banking</p>

                        {paymentMethod === 'bank' && (
                          <div className="mt-4 p-4 bg-bg rounded-lg">
                            <div className="text-center">
                              <div className="text-6xl mb-2">📱</div>
                              <p className="text-sm text-text-secondary mb-2">Scan QR code with your banking app</p>

                              {/* Mock QR Code */}
                              <div className="inline-block p-4 bg-white rounded-lg border-2 border-text-secondary/20">
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-400 rounded flex items-center justify-center">
                                  <div className="text-xs text-gray-600 text-center">
                                    <div>QR CODE</div>
                                    <div>FOR PAYMENT</div>
                                    <div className="text-xs mt-1">Amount: ${total.toFixed(2)}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 text-left">
                                <h4 className="font-semibold text-text-primary mb-2">Bank Details:</h4>
                                <div className="text-sm text-text-secondary space-y-1">
                                  <p><strong>Bank:</strong> Vietcombank</p>
                                  <p><strong>Account:</strong> 1234567890</p>
                                  <p><strong>Name:</strong> E-Shop Company</p>
                                  <p><strong>Amount:</strong> ${total.toFixed(2)}</p>
                                  <p><strong>Note:</strong> Order #{Date.now()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-text-primary py-4 rounded-lg font-semibold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
