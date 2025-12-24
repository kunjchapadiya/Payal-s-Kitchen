import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingBag, FaUtensils, FaChartLine, FaUserTie, FaCalendarCheck } from 'react-icons/fa';
import Card from '../../components/Card';
import Button from '../../components/Button';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    { icon: FaShoppingBag, label: 'Total Orders', value: '0', color: 'bg-blue-500', change: '+0%' },
    { icon: FaUsers, label: 'Total Customers', value: '0', color: 'bg-green-500', change: '+0%' },
    { icon: FaUtensils, label: 'Products', value: '0', color: 'bg-orange-500', change: '+0%' },
    { icon: FaChartLine, label: 'Revenue', value: '₹0', color: 'bg-purple-500', change: '+0%' },
  ];

  const quickLinks = [
    { icon: FaUtensils, label: 'Manage Products', link: '/admin/products', color: 'bg-orange-500' },
    { icon: FaShoppingBag, label: 'Manage Orders', link: '/admin/orders', color: 'bg-blue-500' },
    { icon: FaUsers, label: 'Manage Customers', link: '/admin/customers', color: 'bg-green-500' },
    { icon: FaUserTie, label: 'Manage Employees', link: '/admin/employees', color: 'bg-purple-500' },
    { icon: FaCalendarCheck, label: 'Subscriptions', link: '/admin/subscriptions', color: 'bg-pink-500' },
    { icon: FaChartLine, label: 'Reports', link: '/admin/reports', color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#2E2E2E]">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-[#F28C28]">{user?.name}</span></p>
            </div>
            <div className="flex gap-3">
              <Link to="/">
                <Button variant="secondary">View Website</Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#2E2E2E] mt-1">{stat.value}</h3>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.link}>
                <Card hover className="text-center">
                  <div className={`w-14 h-14 ${link.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <link.icon className="text-white" size={24} />
                  </div>
                  <p className="font-semibold text-[#2E2E2E] text-sm">{link.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Recent Orders</h2>
            <Card>
              <div className="text-center py-12">
                <FaShoppingBag className="text-gray-300 mx-auto mb-4" size={48} />
                <p className="text-gray-500">No recent orders</p>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">New Customers</h2>
            <Card>
              <div className="text-center py-12">
                <FaUsers className="text-gray-300 mx-auto mb-4" size={48} />
                <p className="text-gray-500">No new customers</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
