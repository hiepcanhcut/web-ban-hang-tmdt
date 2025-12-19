'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: ''
  });
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || '',
        city: parsedUser.city || '',
        district: parsedUser.district || ''
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    try {
      // Update user data in localStorage
      const updatedUser: User = {
        ...user!,
        ...formData
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        district: user.district || ''
      });
    }
    setEditing(false);
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">My Profile</h1>
            <p className="text-text-secondary">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg shadow-soft p-6">
                {/* Profile Avatar */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-3xl text-text-primary font-bold mx-auto mb-4">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary">{user.name}</h2>
                  <p className="text-text-secondary text-sm">{user.email}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                    user.role === 'admin'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent/10 text-accent'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full text-left px-4 py-3 bg-bg rounded-lg hover:bg-bg/80 transition-colors flex items-center space-x-3"
                  >
                    <span className="text-xl">📦</span>
                    <span className="text-text-primary font-medium">My Orders</span>
                  </button>

                  <button
                    onClick={() => router.push('/write-reviews')}
                    className="w-full text-left px-4 py-3 bg-bg rounded-lg hover:bg-bg/80 transition-colors flex items-center space-x-3"
                  >
                    <span className="text-xl">⭐</span>
                    <span className="text-text-primary font-medium">Write Reviews</span>
                  </button>

                  <button
                    onClick={() => router.push('/cart')}
                    className="w-full text-left px-4 py-3 bg-bg rounded-lg hover:bg-bg/80 transition-colors flex items-center space-x-3"
                  >
                    <span className="text-xl">🛒</span>
                    <span className="text-text-primary font-medium">Shopping Cart</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => router.push('/admin')}
                      className="w-full text-left px-4 py-3 bg-bg rounded-lg hover:bg-bg/80 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-xl">⚙️</span>
                      <span className="text-text-primary font-medium">Admin Panel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-text-primary">Personal Information</h3>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-text-primary rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      <FaEdit className="text-sm" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-2 px-4 py-2 bg-success text-text-primary rounded-lg hover:bg-success/80 transition-colors"
                      >
                        <FaSave className="text-sm" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-error text-text-primary rounded-lg hover:bg-error/80 transition-colors"
                      >
                        <FaTimes className="text-sm" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0 mt-1">
                      <FaUser />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-text-primary">{user.name || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent flex-shrink-0 mt-1">
                      <FaEnvelope />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                      {editing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <p className="text-text-primary">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center text-success flex-shrink-0 mt-1">
                      <FaPhone />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
                      {editing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-text-primary">{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center text-warning flex-shrink-0 mt-1">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">Address</label>
                      {editing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                            placeholder="Street address"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              name="district"
                              value={formData.district}
                              onChange={handleInputChange}
                              className="px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                              placeholder="District"
                            />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                              placeholder="City"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-text-primary">
                          {user.address ? (
                            <div>
                              <p>{user.address}</p>
                              {user.district && user.city && (
                                <p>{user.district}, {user.city}</p>
                              )}
                            </div>
                          ) : (
                            <p>Not provided</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-6">Account Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-bg rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-primary">Change Password</h4>
                      <p className="text-sm text-text-secondary">Update your account password</p>
                    </div>
                    <button className="px-4 py-2 border border-text-secondary/30 text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-primary">Email Notifications</h4>
                      <p className="text-sm text-text-secondary">Receive order updates and promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-text-secondary/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-primary">Account Status</h4>
                      <p className="text-sm text-text-secondary">Your account is active and verified</p>
                    </div>
                    <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-surface rounded-lg shadow-soft p-6 border border-error/20">
                <h3 className="text-xl font-semibold text-text-primary mb-6">Danger Zone</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-error/5 rounded-lg border border-error/20">
                    <div>
                      <h4 className="font-medium text-error">Delete Account</h4>
                      <p className="text-sm text-text-secondary">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-4 py-2 bg-error text-text-primary rounded-lg hover:bg-error/80 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
