'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Your cart is empty</h2>
              <p className="text-text-secondary mb-8">Add some products to get started!</p>
              <Link
                href="/"
                className="bg-primary text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-surface rounded-lg shadow-soft p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-bg">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-text-secondary mb-2">
                          Size: {item.size} | Color: {item.color}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-text-secondary/30 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-3 py-1 text-text-secondary hover:text-primary hover:bg-bg transition-colors"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 text-text-primary font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="px-3 py-1 text-text-secondary hover:text-primary hover:bg-bg transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-error hover:text-error/80 text-sm underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-text-secondary">
                          ${item.product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={clearCart}
                    className="text-error hover:text-error/80 underline text-sm"
                  >
                    Clear All Items
                  </button>
                  <Link
                    href="/"
                    className="text-primary hover:text-primary/80 underline text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-surface rounded-lg shadow-soft p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-text-primary mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal ({cartItems.length} items)</span>
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

                    <hr className="border-text-secondary/20" />

                    <div className="flex justify-between font-semibold text-text-primary text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full bg-primary text-text-primary py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors text-center mb-4"
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="text-center">
                    <Link href="/login" className="text-primary hover:text-primary/80 text-sm underline">
                      Sign in for faster checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
