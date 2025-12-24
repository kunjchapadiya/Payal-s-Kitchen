import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaCalendarAlt, FaUtensils, FaUser, FaHeart } from 'react-icons/fa';
import Card from '../../components/Card';
import Button from '../../components/Button';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  const quickActions = [
    { icon: FaUtensils, label: 'Browse Menu', link: '/menu', color: 'bg-orange-500' },
    { icon: FaShoppingBag, label: 'My Orders', link: '/user/orders', color: 'bg-blue-500' },
    { icon: FaCalendarAlt, label: 'Subscriptions', link: '/subscription', color: 'bg-green-500' },
    { icon: FaUser, label: 'My Profile', link: '/user/profile', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#2E2E2E]">
                Welcome back, <span className="text-[#F28C28]">{user?.name}!</span>
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your orders today</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Orders</p>
                <h3 className="text-3xl font-bold text-[#2E2E2E] mt-1">0</h3>
              </div>
              <div className="w-12 h-12 bg-[#F28C28]/10 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-[#F28C28]" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Subscriptions</p>
                <h3 className="text-3xl font-bold text-[#2E2E2E] mt-1">0</h3>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-green-500" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Favorite Items</p>
                <h3 className="text-3xl font-bold text-[#2E2E2E] mt-1">0</h3>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <FaHeart className="text-purple-500" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card hover className="text-center">
                  <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <action.icon className="text-white" size={28} />
                  </div>
                  <p className="font-semibold text-[#2E2E2E]">{action.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#2E2E2E]">Recent Orders</h2>
            <Link to="/user/orders" className="text-[#F28C28] font-semibold hover:underline">
              View All
            </Link>
          </div>
          <Card>
            <div className="text-center py-12">
              <FaShoppingBag className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-500">No orders yet</p>
              <Link to="/menu">
                <Button variant="primary" className="mt-4">
                  Start Ordering
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
