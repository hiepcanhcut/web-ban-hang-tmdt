'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  size?: string;
  color?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  loading?: boolean;
}

const CartSidebar = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  loading = false
}: CartSidebarProps) => {
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      await onUpdateQuantity(itemId, newQuantity);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      await onRemoveItem(itemId);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-text-secondary/20">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🛒</span>
            <h2 className="text-xl font-semibold text-text-primary">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg rounded-full transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4 animate-pulse">
                  <div className="w-16 h-16 bg-text-secondary/10 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-text-secondary/10 rounded"></div>
                    <div className="h-4 bg-text-secondary/10 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Your cart is empty</h3>
              <p className="text-text-secondary mb-6">Add some products to get started!</p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-flex items-center px-6 py-3 bg-primary text-text-primary rounded-full font-semibold hover:bg-primary/80 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex space-x-4 p-4 bg-bg rounded-lg">
                {/* Product Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-text-secondary/10">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product._id}`}
                    onClick={onClose}
                    className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>

                  {/* Variants */}
                  <div className="text-sm text-text-secondary space-y-1 mt-1">
                    {item.size && <div>Size: {item.size}</div>}
                    {item.color && <div>Color: {item.color}</div>}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={updatingItems.has(item._id)}
                        className="w-6 h-6 hover:bg-surface rounded transition-colors disabled:opacity-50 text-text-secondary font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium text-text-primary">
                        {updatingItems.has(item._id) ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={updatingItems.has(item._id)}
                        className="w-6 h-6 hover:bg-surface rounded transition-colors disabled:opacity-50 text-text-secondary font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={updatingItems.has(item._id)}
                      className="w-6 h-6 hover:bg-error/10 rounded transition-colors disabled:opacity-50 text-error"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="font-semibold text-text-primary">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-sm text-text-secondary">
                      ${item.product.price.toFixed(2)} each
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-text-secondary/20 p-6 space-y-4">
            {/* Summary */}
            <div className="space-y-2 text-sm">
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
              <div className="border-t border-text-secondary/20 pt-2">
                <div className="flex justify-between font-semibold text-text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-primary text-text-primary text-center py-3 rounded-full font-semibold hover:bg-primary/80 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full border border-text-secondary/30 text-text-secondary text-center py-3 rounded-full font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
