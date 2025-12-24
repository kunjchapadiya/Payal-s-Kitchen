import React from 'react';
import Card from '../../components/Card';
import { FaUsers } from 'react-icons/fa';

const AdminCustomers = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins] py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#2E2E2E] mb-8">Manage Customers</h1>

        <Card>
          <div className="text-center py-16">
            <FaUsers className="text-gray-300 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">No Customers Yet</h3>
            <p className="text-gray-500">Customer list will appear here</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminCustomers;
