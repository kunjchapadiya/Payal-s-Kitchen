import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaUserCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/login');
    };

    const menuItems = [
        { path: '/chef/orders', name: 'Manage Orders', icon: <FaClipboardList /> },
        { path: '/chef/profile', name: 'My Profile', icon: <FaUserCircle /> },
    ];

    return (
        <div className={`h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-5 flex-1 flex flex-col">
                <div className="logo mb-10 flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">Chef's Panel</span>
                    <button className="md:hidden text-gray-500 hover:text-red-500 transition-colors" onClick={onClose}>
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 768 && onClose && onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-orange-50 text-orange-600 font-bold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600 font-medium'
                                }`
                            }
                        >
                            <div className="text-xl">{item.icon}</div>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="border-t border-gray-100 pt-5 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-red-600 w-full transition-all font-medium"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
