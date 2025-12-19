'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

const OrderManagementTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const allOrders = JSON.parse(ordersData);
        setOrders(allOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const allOrders = JSON.parse(ordersData);
        const orderToUpdate = allOrders.find((order: Order) => order._id === orderId);

        if (orderToUpdate && newStatus === 'delivered' && orderToUpdate.status !== 'delivered') {
          // Order is being marked as delivered for the first time - add to revenue
          updateRevenue(orderToUpdate.total);
        }

        const updatedOrders = allOrders.map((order: Order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);

        // Convert status to Vietnamese for display
        const statusLabels: { [key: string]: string } = {
          'pending': 'Chờ xử lý',
          'awaiting_payment': 'Chờ thanh toán',
          'processing': 'Đang trung chuyển',
          'in_transit': 'Đang trung chuyển',
          'shipped': 'Đang vận chuyển',
          'delivered': 'Đã giao',
          'cancelled': 'Bị huỷ'
        };

        alert(`Trạng thái đơn hàng đã cập nhật thành: ${statusLabels[newStatus] || newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const deleteOrder = (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const allOrders = JSON.parse(ordersData);
        const orderToDelete = allOrders.find((order: Order) => order._id === orderId);

        if (orderToDelete && orderToDelete.status === 'delivered') {
          // Order was delivered - subtract from revenue
          updateRevenue(-orderToDelete.total);
        }

        const updatedOrders = allOrders.filter((order: Order) => order._id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);

        alert('Order deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const updateRevenue = (amount: number) => {
    try {
      const revenueData = localStorage.getItem('revenue') || '{"total": 0, "orders": 0, "monthly": {}}';
      const revenue = JSON.parse(revenueData);

      // Update total revenue
      revenue.total += amount;

      // Update order count
      revenue.orders += 1;

      // Update monthly revenue
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      if (!revenue.monthly[currentMonth]) {
        revenue.monthly[currentMonth] = 0;
      }
      revenue.monthly[currentMonth] += amount;

      localStorage.setItem('revenue', JSON.stringify(revenue));
    } catch (error) {
      console.error('Error updating revenue:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent/10 text-accent';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500';
      case 'in_transit':
        return 'bg-yellow-500/10 text-yellow-500';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Order Management</h2>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface rounded-lg shadow-soft p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Orders Yet</h3>
          <p className="text-text-secondary">Orders will appear here when customers make purchases.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-surface rounded-lg shadow-soft p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    Order #{order._id.split('_')[1]}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {order.customer.name} • {order.customer.email}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getStatusColor(order.status)}`}>
                    {order.status === 'pending' ? 'Chờ xử lý' :
                     order.status === 'awaiting_payment' ? 'Chờ thanh toán' :
                     order.status === 'processing' ? 'Đang trung chuyển' :
                     order.status === 'in_transit' ? 'Đang trung chuyển' :
                     order.status === 'shipped' ? 'Đang vận chuyển' :
                     order.status === 'delivered' ? 'Đã giao' :
                     order.status === 'cancelled' ? 'Bị huỷ' :
                     order.status}
                  </div>
                  <p className="text-lg font-bold text-text-primary">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {order.paymentMethod === 'cod' ? 'COD' : 'Bank Transfer'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {order.items.map((item) => (
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
              </div>

              {/* Shipping Info */}
              <div className="bg-bg rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-text-primary mb-2">Shipping Address</h4>
                <p className="text-sm text-text-secondary">
                  {order.customer.address}<br />
                  {order.customer.district}, {order.customer.city}<br />
                  Phone: {order.customer.phone}
                </p>
              </div>

              {/* Status Update */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Update Status
                  </label>
                  <select
                    defaultValue={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="awaiting_payment">Chờ thanh toán</option>
                    <option value="processing">Đang trung chuyển</option>
                    <option value="in_transit">Đang trung chuyển</option>
                    <option value="shipped">Đang vận chuyển</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Bị huỷ</option>
                  </select>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-sm text-text-secondary">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                  <p className="text-lg font-bold text-text-primary">
                    Total: ${order.total.toFixed(2)}
                  </p>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="px-3 py-1 bg-error text-text-primary text-sm rounded hover:bg-error/80 transition-colors"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface RevenueData {
  total: number;
  orders: number;
  monthly: { [key: string]: number };
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [revenue, setRevenue] = useState<RevenueData>({ total: 0, orders: 0, monthly: {} });
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
    loadProducts();
    loadRevenue();
  }, [router]);

  const loadRevenue = () => {
    try {
      const revenueData = localStorage.getItem('revenue');
      if (revenueData) {
        const parsedRevenue = JSON.parse(revenueData);
        setRevenue(parsedRevenue);
      }
    } catch (error) {
      console.error('Error loading revenue:', error);
    }
  };

  const loadProducts = async () => {
    // First, immediately load from localStorage
    const savedProducts = localStorage.getItem('admin_products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
        return;
      } catch (error) {
        console.error('Error parsing saved products:', error);
      }
    }

    // Load sample data immediately
    try {
      const sampleResponse = await fetch('/sample-products.json');
      const sampleData = await sampleResponse.json();
      setProducts(sampleData.products);

      // In background, try to fetch from API (non-blocking)
      fetchProductsFromAPI();
    } catch (sampleError) {
      console.error('Error loading sample data:', sampleError);
      setProducts([]);
    }
  };

  const fetchProductsFromAPI = async () => {
    try {
      // Set timeout to avoid long waits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      const response = await fetch('http://localhost:5000/api/products?limit=100', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (error) {
      // API failed, keep current products (sample data)
      console.log('API not available, using local data');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('edit-product');
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    // Get form elements manually
    const nameInput = document.querySelector('input[name="edit-name"]') as HTMLInputElement;
    const categorySelect = document.querySelector('select[name="edit-category"]') as HTMLSelectElement;
    const priceInput = document.querySelector('input[name="edit-price"]') as HTMLInputElement;
    const stockInput = document.querySelector('input[name="edit-stock"]') as HTMLInputElement;
    const descriptionTextarea = document.querySelector('textarea[name="edit-description"]') as HTMLTextAreaElement;
    const isOnSaleCheckbox = document.querySelector('input[name="edit-isOnSale"]') as HTMLInputElement;
    const isNewCheckbox = document.querySelector('input[name="edit-isNew"]') as HTMLInputElement;

    if (!nameInput || !categorySelect || !priceInput || !stockInput || !descriptionTextarea) {
      alert('Form elements not found');
      return;
    }

    const name = nameInput.value.trim();
    const category = categorySelect.value;
    const price = parseFloat(priceInput.value) || 0;
    const stock = parseInt(stockInput.value) || 0;
    const description = descriptionTextarea.value.trim();
    const isOnSale = isOnSaleCheckbox?.checked || false;
    const isNew = isNewCheckbox?.checked || false;

    if (!name || !description || price <= 0 || stock < 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    // Update the product
    const updatedProduct: Product = {
      ...editingProduct,
      name,
      category,
      price,
      stock,
      description,
      isOnSale,
      isNew,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    };

    const updatedProducts = products.map(p => p._id === editingProduct._id ? updatedProduct : p);
    setProducts(updatedProducts);

    // Save to localStorage for persistence with error handling
    try {
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.warn('Storage quota exceeded for products, some data may be lost');
      alert('Warning: Product data storage limit reached. Some products may not be saved.');
    }

    setEditingProduct(null);
    alert('Product updated successfully!');
    setActiveTab('products');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    // Mock delete for demo
    const updatedProducts = products.filter(p => p._id !== productId);
    setProducts(updatedProducts);

    // Save to localStorage for persistence
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));

    alert('Product deleted successfully!');
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSelectedImages = Array.from(files);
    setSelectedImages(prev => [...prev, ...newSelectedImages]);

    // Convert images to base64 for persistence
    const newPreviewUrls: string[] = [];
    for (const file of newSelectedImages) {
      const base64 = await fileToBase64(file);
      newPreviewUrls.push(base64);
    }

    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreateProduct = async () => {
    // Get form elements manually
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const categorySelect = document.querySelector('select[name="category"]') as HTMLSelectElement;
    const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
    const stockInput = document.querySelector('input[name="stock"]') as HTMLInputElement;
    const descriptionTextarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    const isOnSaleCheckbox = document.querySelector('input[name="isOnSale"]') as HTMLInputElement;
    const isNewCheckbox = document.querySelector('input[name="isNew"]') as HTMLInputElement;

    if (!nameInput || !categorySelect || !priceInput || !stockInput || !descriptionTextarea) {
      alert('Form elements not found');
      return;
    }

    const name = nameInput.value.trim();
    const category = categorySelect.value;
    const price = parseFloat(priceInput.value) || 0;
    const stock = parseInt(stockInput.value) || 0;
    const description = descriptionTextarea.value.trim();
    const isOnSale = isOnSaleCheckbox?.checked || false;
    const isNew = isNewCheckbox?.checked || false;

    if (!name || !description || price <= 0 || stock < 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    const productData = {
      name,
      category,
      price,
      stock,
      description,
      isOnSale,
      isNew,
      images: imagePreviewUrls.length > 0 ? imagePreviewUrls : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop']
    };

    // Mock product creation
    const newProduct: Product = {
      _id: `prod_${Date.now()}`,
      ...productData,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      rating: 0,
      reviewsCount: 0,
      salePrice: null
    };

    // Add to products list
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);

    // Save to localStorage for persistence
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));

    // Also update the main app's product data by updating the sample file
    try {
      const sampleResponse = await fetch('/sample-products.json');
      const sampleData = await sampleResponse.json();

      // Add new product to the existing products
      sampleData.products.push(newProduct);

      console.log('Product saved to localStorage and would be saved to database:', newProduct);
    } catch (error) {
      console.error('Error updating sample data:', error);
    }

    setSelectedImages([]);
    setImagePreviewUrls([]);

    // Reset form
    nameInput.value = '';
    priceInput.value = '';
    stockInput.value = '';
    descriptionTextarea.value = '';
    if (isOnSaleCheckbox) isOnSaleCheckbox.checked = false;
    if (isNewCheckbox) isNewCheckbox.checked = false;

    alert('Product created successfully! It will appear in the product catalog.');
    setActiveTab('products');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCreateProduct();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface shadow-soft border-b border-text-secondary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg shadow-soft p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Admin Menu</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-primary text-text-primary'
                      : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'products'
                      ? 'bg-primary text-text-primary'
                      : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  📦 Products
                </button>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'add-product'
                      ? 'bg-primary text-text-primary'
                      : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  ➕ Add Product
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary text-text-primary'
                      : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  📋 Order Management
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'users'
                      ? 'bg-primary text-text-primary'
                      : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  👥 Users
                </button>

                <button
                  onClick={() => router.push('/admin/sales-report')}
                  className="w-full text-left px-4 py-2 rounded-lg transition-colors text-text-secondary hover:bg-bg"
                >
                  📊 Sales Report
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary">Dashboard Overview</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-surface p-6 rounded-lg shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-secondary text-sm">Total Products</p>
                        <p className="text-2xl font-bold text-text-primary">{products.length}</p>
                      </div>
                      <span className="text-3xl">📦</span>
                    </div>
                  </div>

                  <div className="bg-surface p-6 rounded-lg shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-secondary text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-text-primary">{revenue.orders}</p>
                      </div>
                      <span className="text-3xl">🛒</span>
                    </div>
                  </div>

                  <div className="bg-surface p-6 rounded-lg shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-secondary text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-text-primary">1</p>
                      </div>
                      <span className="text-3xl">👤</span>
                    </div>
                  </div>

                  <div className="bg-surface p-6 rounded-lg shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-secondary text-sm">Revenue</p>
                        <p className="text-2xl font-bold text-text-primary">${revenue.total.toFixed(2)}</p>
                      </div>
                      <span className="text-3xl">💰</span>
                    </div>
                  </div>
                </div>

                {/* Recent Products */}
                <div className="bg-surface rounded-lg shadow-soft p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">Recent Products</h3>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product._id} className="flex items-center space-x-4 p-4 bg-bg rounded-lg">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{product.name}</h4>
                          <p className="text-sm text-text-secondary">${product.price.toLocaleString()}</p>
                        </div>
                        <div className="text-sm text-text-secondary">
                          {product.stock} in stock
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-text-primary">Product Management</h2>
                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="px-4 py-2 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Add New Product
                  </button>
                </div>

                <div className="bg-surface rounded-lg shadow-soft overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-bg">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-text-secondary/10">
                        {products.map((product) => (
                          <tr key={product._id} className="hover:bg-bg/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-text-primary">{product.name}</div>
                                  <div className="text-sm text-text-secondary">ID: {product._id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                              ${product.price.toLocaleString()}
                              {product.salePrice && (
                                <span className="text-error ml-1">
                                  (${product.salePrice.toLocaleString()})
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                product.stock > 10
                                  ? 'bg-success/10 text-success'
                                  : product.stock > 0
                                  ? 'bg-accent/10 text-accent'
                                  : 'bg-error/10 text-error'
                              }`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-primary hover:text-primary/80 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-error hover:text-error/80"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'add-product' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary">Add New Product</h2>

                <div className="bg-surface rounded-lg shadow-soft p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary focus:outline-none focus:border-primary"
                        >
                          <option>Electronics</option>
                          <option>Fashion</option>
                          <option>Accessories</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Price (VND)
                        </label>
                        <input
                          type="number"
                          name="price"
                          required
                          min="0"
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          name="stock"
                          required
                          min="0"
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        name="description"
                        required
                        className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                        placeholder="Product description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Product Images
                      </label>

                      {/* Hidden file input */}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />

                      {/* Upload area */}
                      <div className="border-2 border-dashed border-text-secondary/30 rounded-lg p-6 text-center">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-text-secondary mb-2">Click to upload product images</p>
                        <p className="text-sm text-text-secondary/70">PNG, JPG up to 10MB each</p>
                        <label
                          htmlFor="image-upload"
                          className="mt-4 px-4 py-2 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors cursor-pointer inline-block"
                        >
                          Choose Files
                        </label>
                      </div>

                      {/* Image previews */}
                      {imagePreviewUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-text-secondary/20"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-error text-text-primary rounded-full text-sm hover:bg-error/80"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input type="checkbox" name="isOnSale" className="mr-2" />
                        <span className="text-sm text-text-primary">On Sale</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" name="isNew" className="mr-2" />
                        <span className="text-sm text-text-primary">New Product</span>
                      </label>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleCreateProduct}
                        className="px-6 py-3 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors font-medium"
                      >
                        Create Product
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="px-6 py-3 border border-text-secondary/30 text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit-product' && editingProduct && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary">Edit Product</h2>

                <div className="bg-surface rounded-lg shadow-soft p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="edit-name"
                          required
                          defaultValue={editingProduct.name}
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Category
                        </label>
                        <select
                          name="edit-category"
                          defaultValue={editingProduct.category}
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary focus:outline-none focus:border-primary"
                        >
                          <option>Electronics</option>
                          <option>Fashion</option>
                          <option>Accessories</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Price (VND)
                        </label>
                        <input
                          type="number"
                          name="edit-price"
                          required
                          min="0"
                          defaultValue={editingProduct.price}
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          name="edit-stock"
                          required
                          min="0"
                          defaultValue={editingProduct.stock}
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        name="edit-description"
                        required
                        defaultValue={editingProduct.description}
                        className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                        placeholder="Product description..."
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="edit-isOnSale"
                          defaultChecked={editingProduct.isOnSale}
                          className="mr-2"
                        />
                        <span className="text-sm text-text-primary">On Sale</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="edit-isNew"
                          defaultChecked={editingProduct.isNew}
                          className="mr-2"
                        />
                        <span className="text-sm text-text-primary">New Product</span>
                      </label>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleUpdateProduct}
                        className="px-6 py-3 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors font-medium"
                      >
                        Update Product
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setActiveTab('products');
                        }}
                        className="px-6 py-3 border border-text-secondary/30 text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <OrderManagementTab />
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary">User Management</h2>
                <div className="bg-surface rounded-lg shadow-soft p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-bg rounded-lg">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-text-primary font-bold">
                        A
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{user.name}</p>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary ml-auto">
                        Admin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
