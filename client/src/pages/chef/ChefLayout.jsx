import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/chef/Sidebar'
import { FaBars, FaUserCircle } from "react-icons/fa";

const ChefLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className='flex min-h-screen bg-gray-50'>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen w-full transition-all duration-300">
                <header className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm md:shadow-none md:bg-transparent md:p-0 border border-gray-100 md:border-none">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-700 hover:text-orange-600 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FaBars size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Chef Dashboard</h1>
                            <p className="text-gray-500 text-sm">Welcome back, Chef!</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 relative hover:bg-orange-200 transition-colors cursor-pointer">
                            <FaUserCircle size={24} />
                        </div>
                    </div>
                </header>

                <Outlet />
            </div>
        </div>
    )
}

export default ChefLayout
