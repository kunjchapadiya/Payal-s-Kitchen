import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//firebase
import { testDatabaseConnection } from './utils/testFirebase';

import Register from './pages/Register';
import Login from './pages/Login';
import Otp from './pages/Otp';

// components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentSucess from './components/PaymentSucess';

// user side
import Home from './pages/user/Home';
import Subscription from './pages/user/Subscription';
import Menu from './pages/user/Menu';
import Cart from './pages/user/Cart';
import AboutUs from './pages/user/AboutUs';
import ContactUs from './pages/user/ContactUs';
import Catering from './pages/user/Catering';
import Profile from './pages/user/Profile';
import Checkout from './pages/user/Checkout';

// admin side
import AdminLayout from './pages/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import AdminMenu from './pages/admin/Menu';
import Chef from './pages/admin/Chef';
import UserManagement from './pages/admin/UserManagement';
import Orders from './pages/admin/Orders';
import Payments from './pages/admin/Payments';
import CateringDashboard from './pages/admin/CateringDashboard';
import Reviews from './pages/admin/Reviews';
import Complaints from './pages/admin/Complaints';
import ManagePlans from './pages/admin/ManagePlans';
import AdminOffers from './pages/admin/Offers';

// chef side
import ChefLayout from './pages/chef/ChefLayout';
import ChefOrders from './pages/chef/ChefOrders';
import ChefProfile from './pages/chef/ChefProfile';

const App = () => {
  const location = useLocation();

  // Test Firebase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testDatabaseConnection();
      if (result.success) {
        console.log('🔥 Firebase Database Connected!');
      } else {
        console.log(`Firebase Error: ${result.message}`);
      }
    };
    checkConnection();
  }, []);

  // Pages where Navbar + Footer should NOT show
  const hideOnPages = ["/login", "/register", "/admin", "/chef", "/otp"];

  const shouldHide = hideOnPages.includes(location.pathname) || location.pathname.startsWith("/admin") || location.pathname.startsWith("/chef");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Show Navbar only if NOT on login/register */}
      {!shouldHide && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />

        <Route path="/" element={<Home />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/order" element={
          <ProtectedRoute>
            <Catering />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={<PaymentSucess />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* admin side - Protected for admin role only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="chefs" element={<Chef />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="catering" element={<CateringDashboard />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="plans" element={<ManagePlans />} />
          <Route path="offers" element={<AdminOffers />} />
        </Route>

        {/* chef side - Protected for chef role only */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <ChefLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChefOrders />} />
          <Route path="orders" element={<ChefOrders />} />
          <Route path="profile" element={<ChefProfile />} />
        </Route>
      </Routes>

      {/* Show Footer only if NOT on login/register */}
      {!shouldHide && <Footer />}
    </>
  );
}

export default App;
