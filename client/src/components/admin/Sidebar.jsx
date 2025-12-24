import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaUsers,
    FaUserTie,
    FaClipboardList,
    FaMoneyBillWave,
    FaUtensils,
    FaBookOpen,
    FaCommentDots,
    FaStar,
    FaQuestionCircle,
    FaSignOutAlt,
    FaExclamationCircle,
    FaTag,
    FaTimes
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/users', name: 'Manage User', icon: <FaUsers /> },
        { path: '/admin/chefs', name: 'Manage Chef', icon: <FaUserTie /> },
        { path: '/admin/orders', name: 'Manage Order', icon: <FaClipboardList /> },
        { path: '/admin/payments', name: 'Payment Detail', icon: <FaMoneyBillWave /> },
        { path: '/admin/catering', name: 'Catering Manage', icon: <FaUtensils /> },
        { path: '/admin/plans', name: 'Subscriptions', icon: <FaBookOpen /> },
        { path: '/admin/menu', name: 'Menu Management', icon: <FaBookOpen /> },
        { path: '/admin/offers', name: 'Manage Offers', icon: <FaTag /> },
        { path: '/admin/reviews', name: 'Review', icon: <FaStar /> },
        { path: '/admin/complaints', name: 'Complaints', icon: <FaExclamationCircle /> },
    ];

    const handleLogout = () => {
        // Implement logout logic here (clear token, etc.)
        navigate('/login');
    };

    return (
        <div className={`h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <h1 className="text-2xl font-bold text-orange-600">Admin Panel</h1>
                <button onClick={onClose} className="md:hidden text-gray-500 hover:text-red-500 transition-colors">
                    <FaTimes size={24} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                            // Optional: Close sidebar on mobile when a link is clicked
                            if (window.innerWidth < 768) onClose && onClose();
                        }}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                >
                    <FaSignOutAlt className="text-xl" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
