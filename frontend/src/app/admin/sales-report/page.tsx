'use client';

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

interface RevenueData {
  total: number;
  orders: number;
  monthly: { [key: string]: number };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function SalesReportPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenue, setRevenue] = useState<RevenueData>({ total: 0, orders: 0, monthly: {} });
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    loadData();
  }, [router]);

  const loadData = () => {
    // Load orders
    const ordersData = localStorage.getItem('orders');
    if (ordersData) {
      const allOrders = JSON.parse(ordersData);
      const deliveredOrders = allOrders.filter((order: Order) => order.status === 'delivered');
      setOrders(deliveredOrders);
    }

    // Load revenue
    const revenueData = localStorage.getItem('revenue');
    if (revenueData) {
      setRevenue(JSON.parse(revenueData));
    } else {
      // If no revenue data, calculate from existing delivered orders
      calculateRevenueFromOrders();
    }

    // Load products
    const productsData = localStorage.getItem('admin_products');
    if (productsData) {
      setProducts(JSON.parse(productsData));
    }
  };

  const calculateRevenueFromOrders = () => {
    const ordersData = localStorage.getItem('orders');
    if (ordersData) {
      const allOrders = JSON.parse(ordersData);
      const deliveredOrders = allOrders.filter((order: Order) => order.status === 'delivered');

      let totalRevenue = 0;
      let totalOrders = deliveredOrders.length;
      const monthlyRevenue: { [key: string]: number } = {};

      deliveredOrders.forEach((order: Order) => {
        totalRevenue += order.total;

        // Calculate monthly revenue
        const orderDate = new Date(order.createdAt);
        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyRevenue[monthKey]) {
          monthlyRevenue[monthKey] = 0;
        }
        monthlyRevenue[monthKey] += order.total;
      });

      const revenueData = {
        total: totalRevenue,
        orders: totalOrders,
        monthly: monthlyRevenue
      };

      setRevenue(revenueData);
      localStorage.setItem('revenue', JSON.stringify(revenueData));
    }
  };

  const getTopSellingProducts = () => {
    const productSales: { [key: string]: { name: string; sold: number; revenue: number; image: string } } = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.product._id]) {
          productSales[item.product._id].sold += item.quantity;
          productSales[item.product._id].revenue += item.product.price * item.quantity;
        } else {
          productSales[item.product._id] = {
            name: item.product.name,
            sold: item.quantity,
            revenue: item.product.price * item.quantity,
            image: item.product.image
          };
        }
      });
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const getMonthlyRevenue = () => {
    const monthlyData = Object.entries(revenue.monthly || {})
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return monthlyData;
  };

  const getTotalItemsSold = () => {
    return orders.reduce((total, order) =>
      total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);
  };

  const getAverageOrderValue = () => {
    return revenue.orders > 0 ? revenue.total / revenue.orders : 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topProducts = getTopSellingProducts();
  const monthlyRevenue = getMonthlyRevenue();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface shadow-soft border-b border-text-secondary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary">Sales Report</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  calculateRevenueFromOrders();
                  loadData();
                }}
                className="px-4 py-2 bg-accent text-text-primary rounded-lg hover:bg-accent/80 transition-colors"
              >
                Recalculate Revenue
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-lg shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-success">${revenue.total.toFixed(2)}</p>
                </div>
                <span className="text-4xl">💰</span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Orders Completed</p>
                  <p className="text-3xl font-bold text-primary">{revenue.orders}</p>
                </div>
                <span className="text-4xl">📦</span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Items Sold</p>
                  <p className="text-3xl font-bold text-accent">{getTotalItemsSold()}</p>
                </div>
                <span className="text-4xl">🛍️</span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Avg Order Value</p>
                  <p className="text-3xl font-bold text-warning">${getAverageOrderValue().toFixed(2)}</p>
                </div>
                <span className="text-4xl">📊</span>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-surface rounded-lg shadow-soft p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Monthly Revenue</h2>
            {monthlyRevenue.length > 0 ? (
              <div className="space-y-4">
                {monthlyRevenue.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 bg-bg rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-text-primary font-bold">
                        {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {new Date(month.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-sm text-text-secondary">Monthly Revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">${month.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary">No revenue data available yet.</p>
              </div>
            )}
          </div>

          {/* Top Selling Products */}
          <div className="bg-surface rounded-lg shadow-soft p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Top Selling Products</h2>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-bg rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-text-primary font-bold">
                        #{index + 1}
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-text-primary">{product.name}</p>
                        <p className="text-sm text-text-secondary">{product.sold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">${product.revenue.toFixed(2)}</p>
                      <p className="text-sm text-text-secondary">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary">No sales data available yet.</p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-surface rounded-lg shadow-soft p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Recent Completed Orders</h2>
            {orders.slice(0, 10).length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 10).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-bg rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center text-text-primary font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          Order #{order._id.split('_')[1]}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {order.customer.name} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {order.items.length} items • {order.paymentMethod === 'cod' ? 'COD' : 'Bank Transfer'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary">No completed orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
