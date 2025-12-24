import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Example component demonstrating role-based rendering
 * This shows how to conditionally display content based on user roles
 */
const RoleBasedExample = () => {
    const { user, hasRole, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Role-Based Access Demo</h1>

            {/* Show current user info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Current User Info</h2>
                <p><strong>Name:</strong> {user?.displayName || user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>

            {/* Admin-only content */}
            {hasRole('admin') && (
                <div className="bg-red-50 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-red-800 mb-4">
                        🔐 Admin Only Section
                    </h2>
                    <p className="text-red-700">
                        This content is only visible to administrators. You can manage users,
                        view analytics, and configure system settings here.
                    </p>
                </div>
            )}

            {/* Chef-only content */}
            {hasRole('chef') && (
                <div className="bg-green-50 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">
                        👨‍🍳 Chef Only Section
                    </h2>
                    <p className="text-green-700">
                        This content is only visible to chefs. You can manage menus,
                        view orders, and update recipes here.
                    </p>
                </div>
            )}

            {/* User-only content */}
            {hasRole('user') && (
                <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4">
                        👤 Customer Section
                    </h2>
                    <p className="text-blue-700">
                        This content is only visible to customers. You can browse menu,
                        place orders, and manage your subscriptions here.
                    </p>
                </div>
            )}

            {/* Content for multiple roles */}
            {hasRole(['admin', 'chef']) && (
                <div className="bg-purple-50 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-purple-800 mb-4">
                        🤝 Admin & Chef Section
                    </h2>
                    <p className="text-purple-700">
                        This content is visible to both admins and chefs. You can collaborate
                        on menu planning and order management here.
                    </p>
                </div>
            )}

            {/* Public content for all authenticated users */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    📢 Public Section
                </h2>
                <p className="text-gray-700">
                    This content is visible to all authenticated users regardless of role.
                </p>
            </div>
        </div>
    );
};

export default RoleBasedExample;
