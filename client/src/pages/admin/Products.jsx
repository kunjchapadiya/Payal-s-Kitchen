import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FaPlus, FaUtensils } from 'react-icons/fa';

const AdminProducts = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-[Poppins] py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[#2E2E2E]">Manage Products</h1>
          <Button variant="primary" icon={<FaPlus />}>
            Add Product
          </Button>
        </div>

        <Card>
          <div className="text-center py-16">
            <FaUtensils className="text-gray-300 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">No Products Yet</h3>
            <p className="text-gray-500 mb-6">Start adding products to your menu</p>
            <Button variant="primary" icon={<FaPlus />}>
              Add Your First Product
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;
