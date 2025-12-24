import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FaShoppingBag, FaTruck, FaClock } from 'react-icons/fa';

const UserOrders = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins] py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#2E2E2E] mb-8">My Orders</h1>

        <Card>
          <div className="text-center py-16">
            <FaShoppingBag className="text-gray-300 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">Start ordering delicious meals from our menu</p>
            <Button variant="primary" onClick={() => window.location.href = '/menu'}>
              Browse Menu
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserOrders;
