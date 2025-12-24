import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen w-full transition-all duration-300">
                <header className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-700 hover:text-orange-600 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FaBars size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h2>
                            <p className="text-gray-500 text-sm md:text-base mt-1">Welcome back, Admin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                            A
                        </div>
                    </div>
                </header>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 min-h-[calc(100vh-140px)]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
