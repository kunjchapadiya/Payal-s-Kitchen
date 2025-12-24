import React, { useEffect, useState } from 'react';
import {
    FaUser,
    FaHistory,
    FaCreditCard,
    FaLock,
    FaSignOutAlt,
    FaCamera,
    FaBoxOpen,
    FaUtensils,
    FaStar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { database } from '../../../firebase';
import { ref, onValue, update, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');


    const db = database;
    const auth = getAuth();
    const user = auth.currentUser;

    const [userdata, setUserdata] = useState({});

    // Feedback State
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [reviewOrder, setReviewOrder] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return;
        }

        const uid = user.uid;
        const dbRef = ref(db, `users/${uid}`);
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setUserdata(data);
        });

        return () => unsubscribe();
    }, [user, navigate, db]); // Added dependencies

    // Forms
    const { register: registerInfo, handleSubmit: handleSubmitInfo, formState: { errors: errorsInfo } } = useForm({
        defaultValues: userdata // Use userdata instead of user which is auth object
    });

    // Update form default values when userdata changes
    useEffect(() => {
        if (userdata) {
            // Logic to reset form values if needed, but react-hook-form handles this if defaultValues is static or reset is called
        }
    }, [userdata]);

    const { register: registerPass, handleSubmit: handleSubmitPass, watch, reset: resetPass, formState: { errors: errorsPass } } = useForm();
    const newPassword = watch("newPassword");

    const [catering, setCatering] = useState([]);

    useEffect(() => {
        if (user) {
            const cateringRef = ref(db, 'catering');
            const unsubscribe = onValue(cateringRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const userCatering = Object.entries(data)
                        .map(([id, item]) => ({ id, ...item }))
                        .filter(item => item.userId === user.uid);
                    setCatering(userCatering);
                } else {
                    setCatering([]);
                }
            });
            return () => unsubscribe();
        }
    }, [user, db]);

    // Order History State
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            const ordersRef = ref(db, 'orders');
            const unsubscribe = onValue(ordersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const userOrders = Object.values(data)
                        .filter(order => order.userId === user.uid)
                        // Sort by date descending
                        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                    setOrders(userOrders);
                } else {
                    setOrders([]);
                }
            });
            return () => unsubscribe();
        }
    }, [user, db]);

    // Dummy Subscription
    const subscription = {
        plan: 'Premium Tiffin Service',
        status: 'Active',
        renewalDate: 'Nov 01, 2023',
        price: '₹3000/month'
    };

    // Removed duplicate useEffect that was here

    const handleLogout = () => {
        auth.signOut().then(() => {
            toast.success("Logged out successfully! visit again :)");
            navigate("/");
        });
    };

    const onInfoSubmit = async (data) => {
        try {
            const userRef = ref(db, `users/${user.uid}`);
            await update(userRef, data);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    const onPassSubmit = (data) => {
        console.log("Password Change:", data);
        toast.success("Password updated successfully!");
        resetPass();
    };

    const openFeedbackModal = (order) => {
        setReviewOrder(order);
        setRating(5);
        setComment('');
        setShowFeedbackModal(true);
    };

    const handleFeedbackSubmit = async () => {
        if (!comment.trim()) {
            toast.error("Please add a comment");
            return;
        }

        try {
            const feedbackRef = ref(db, 'feedback');
            const newFeedbackRef = push(feedbackRef);
            await set(newFeedbackRef, {
                userId: user.uid,
                userName: userdata.name || user.displayName || 'Anonymous',
                userRole: 'Customer', // Can range based on subscription later
                orderId: reviewOrder.orderId || reviewOrder.id,
                rating: rating,
                comment: comment,
                date: new Date().toISOString(),
                status: 'Approved' // Auto-approve for now or 'Pending'
            });
            toast.success("Thank you for your feedback!");
            setShowFeedbackModal(false);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error("Failed to submit feedback");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Personal Information</h2>

                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                <img
                                    src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=740&t=st=1708688487~exp=1708689087~hmac=e20d20d6f4675402f12f941198c608f02f06z"
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[#F28C28]"
                                />
                                <button className="absolute bottom-0 right-0 bg-[#F28C28] p-2 rounded-full text-white hover:bg-[#d6761f] transition-colors">
                                    <FaCamera size={16} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitInfo(onInfoSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-gray-600 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    {...registerInfo("name", { required: "Name is required" })}
                                    className={`w-full p-3 rounded-lg border ${errorsInfo.name ? 'border-red-500' : 'border-gray-200'} focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none transition-all bg-white`}
                                />
                                {errorsInfo.name && <span className="text-xs text-red-500">{errorsInfo.name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-600 font-medium">Email Address</label>
                                <input
                                    type="email"
                                    {...registerInfo("email", { required: "Email is required" })}
                                    className={`w-full p-3 rounded-lg border ${errorsInfo.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none transition-all bg-white`}
                                />
                                {errorsInfo.email && <span className="text-xs text-red-500">{errorsInfo.email.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-600 font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    {...registerInfo("phone", { required: "Phone is required" })}
                                    className={`w-full p-3 rounded-lg border ${errorsInfo.phone ? 'border-red-500' : 'border-gray-200'} focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none transition-all bg-white`}
                                />
                                {errorsInfo.phone && <span className="text-xs text-red-500">{errorsInfo.phone.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-600 font-medium">Delivery Address</label>
                                <input
                                    type="text"
                                    {...registerInfo("address", { required: "Address is required" })}
                                    className={`w-full p-3 rounded-lg border ${errorsInfo.address ? 'border-red-500' : 'border-gray-200'} focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none transition-all bg-white`}
                                />
                                {errorsInfo.address && <span className="text-xs text-red-500">{errorsInfo.address.message}</span>}
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="bg-[#F28C28] text-white px-8 py-3 rounded-lg hover:bg-[#d6761f] transition-colors font-medium shadow-lg shadow-orange-500/30">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Order History</h2>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.orderId || Math.random()} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-orange-50 rounded-lg text-[#F28C28]">
                                                <FaBoxOpen size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-[#2E2E2E]">
                                                    {order.items?.map(item => `${item.title || item.name} (x${item.quantity})`).join(', ')}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm font-mono text-gray-400 mt-1">#{order.orderId}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-lg text-[#2E2E2E]">₹{order.totalAmount}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'Delivered' || order.status === 'delivered' || order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Cancelled' || order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            {(order.status === 'Delivered' || order.status === 'Completed' || order.status === 'delivered') && (
                                                <button
                                                    onClick={() => openFeedbackModal(order)}
                                                    className="text-xs px-3 py-1 bg-orange-100 text-[#F28C28] rounded-full hover:bg-orange-200 transition-colors flex items-center gap-1"
                                                >
                                                    <FaStar size={10} /> Rate Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                <div className="inline-block p-4 rounded-full bg-orange-50 text-[#F28C28] mb-4">
                                    <FaHistory size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">No Orders Yet</h3>
                                <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
                                <button onClick={() => navigate('/menu')} className="mt-6 px-6 py-2 bg-[#F28C28] text-white rounded-xl font-medium hover:bg-[#d9741e] transition-colors">
                                    Browse Menu
                                </button>
                            </div>
                        )}

                        {/* Feedback Modal */}
                        {showFeedbackModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowFeedbackModal(false)}>
                                <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl m-4" onClick={e => e.stopPropagation()}>
                                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">Rate Your Experience</h3>
                                    <div className="flex justify-center gap-2 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`text-3xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none resize-none"
                                        rows="4"
                                        placeholder="Tell us what you loved..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFeedbackModal(false)}
                                            className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleFeedbackSubmit}
                                            className="flex-1 py-3 bg-[#F28C28] text-white font-bold rounded-xl hover:bg-[#d9741e] shadow-lg shadow-orange-500/20"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'catering':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Catering</h2>
                        <div className="space-y-4">
                            {catering.map((item, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-orange-50 rounded-lg text-[#F28C28]">
                                            <FaUtensils size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#2E2E2E]">{item.eventType}</h3>
                                            <p className="text-sm text-gray-500">{item.requirements || 'No specific requirements'}</p>
                                            <p className="text-sm font-mono text-gray-400 mt-1">{item.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto justify-between">
                                        <span className="font-bold text-lg text-[#2E2E2E]">{item.eventDate}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case 'subscription':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Manage Subscription</h2>
                        <div className="bg-gradient-to-br from-[#F28C28] to-[#ffaa4a] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{subscription.plan}</h3>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                            {subscription.status}
                                        </span>
                                    </div>
                                    <FaCreditCard size={40} className="opacity-80" />
                                </div>

                                <div className="space-y-2 mb-8">
                                    <p className="opacity-90">Next Billing Date: {subscription.renewalDate}</p>
                                    <p className="text-3xl font-bold">{subscription.price}</p>
                                </div>

                                <div className="flex gap-4">
                                    <button className="bg-white text-[#F28C28] px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                        Upgrade Plan
                                    </button>
                                    <button className="bg-transparent border border-white/50 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'password':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Change Password</h2>
                        <form onSubmit={handleSubmitPass(onPassSubmit)} className="max-w-lg space-y-4">
                            <div className="space-y-2">
                                <label className="text-gray-600 font-medium">Current Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        {...registerPass("currentPassword", { required: "Current password is required" })}
                                        className={`w-full p-3 pl-10 rounded-lg border ${errorsPass.currentPassword ? 'border-red-500' : 'border-gray-200'} focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none transition-all bg-white`}
                                    />
                                    <FaLock className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                </div>
                                {errorsPass.currentPassword && <span className="text-xs text-red-500">{errorsPass.currentPassword.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-600 font-medium">New Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        {...registerPass("newPassword", { required: "New password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                                        className={`w-full p-3 pl-10 rounded-lg border ${errorsPass.newPassword ? 'border-red-500' : 'border-gray-200'} focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none transition-all bg-white`}
                                    />
                                    <FaLock className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                </div>
                                {errorsPass.newPassword && <span className="text-xs text-red-500">{errorsPass.newPassword.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-600 font-medium">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        {...registerPass("confirmPassword", { required: "Please confirm password", validate: value => value === newPassword || "Passwords do not match" })}
                                        className={`w-full p-3 pl-10 rounded-lg border ${errorsPass.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none transition-all bg-white`}
                                    />
                                    <FaLock className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                </div>
                                {errorsPass.confirmPassword && <span className="text-xs text-red-500">{errorsPass.confirmPassword.message}</span>}
                            </div>
                            <button type="submit" className="mt-4 bg-[#F28C28] text-white px-8 py-3 rounded-lg hover:bg-[#d6761f] transition-colors font-medium shadow-lg">
                                Update Password
                            </button>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8E7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#2E2E2E]">My Account</h1>
                    <p className="text-gray-600">Manage your profile and settings</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6 bg-gradient-to-r from-[#F28C28] to-[#ffaa4a] text-white">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=740&t=st=1708688487~exp=1708689087~hmac=e20d20d6f4675402f12f941198c608f02f06z"
                                        alt="Avatar"
                                        className="w-12 h-12 rounded-full border-2 border-white"
                                    />
                                    <div>
                                        <p className="font-bold">{userdata.name}</p>
                                        <p className="text-xs opacity-90 text-white/90">{userdata.email}</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-2">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'info' ? 'bg-orange-50 text-[#F28C28] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <FaUser size={18} /> Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-orange-50 text-[#F28C28] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <FaHistory size={18} /> Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab('subscription')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'subscription' ? 'bg-orange-50 text-[#F28C28] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <FaCreditCard size={18} /> Subscription
                                </button>
                                <button
                                    onClick={() => setActiveTab('catering')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'catering' ? 'bg-orange-50 text-[#F28C28] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <FaUtensils size={18} /> Catering Enquiries
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'password' ? 'bg-orange-50 text-[#F28C28] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <FaLock size={18} /> Change Password
                                </button>
                                <div className="my-2 border-t border-gray-100"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                                >
                                    <FaSignOutAlt size={18} /> Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
