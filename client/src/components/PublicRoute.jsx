import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7]">
        <Spinner size="lg" color="orange" />
      </div>
    );
  }

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'employee':
        return <Navigate to="/employee/dashboard" replace />;
      case 'customer':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Not authenticated - show the public page
  return children;
};

export default PublicRoute;
