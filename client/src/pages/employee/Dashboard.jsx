import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTasks, FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';
import Card from '../../components/Card';
import Button from '../../components/Button';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    { icon: FaTasks, label: 'Assigned Tasks', value: '0', color: 'bg-blue-500' },
    { icon: FaClock, label: 'Pending', value: '0', color: 'bg-yellow-500' },
    { icon: FaTruck, label: 'In Progress', value: '0', color: 'bg-orange-500' },
    { icon: FaCheckCircle, label: 'Completed Today', value: '0', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#2E2E2E]">
                Hello, <span className="text-[#F28C28]">{user?.name}!</span>
              </h1>
              <p className="text-gray-600 mt-1">Employee Dashboard - Delivery & Kitchen Tasks</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-[#2E2E2E] mt-1">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Today's Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Today's Assigned Tasks</h2>
          <Card>
            <div className="text-center py-12">
              <FaTasks className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-500 mb-2">No tasks assigned yet</p>
              <p className="text-gray-400 text-sm">Check back later for new assignments</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hover className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                <FaTruck className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#2E2E2E]">Active Deliveries</h3>
                <p className="text-gray-600 text-sm">View orders in progress</p>
              </div>
            </div>
          </Card>

          <Card hover className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#2E2E2E]">Completed Tasks</h3>
                <p className="text-gray-600 text-sm">View your delivery history</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
