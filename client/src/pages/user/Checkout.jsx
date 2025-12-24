import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { database } from '../../../firebase';
import { ref, push, set, get, update } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaMapMarkerAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const clearCart = useCartStore((state) => state.clearCart);

    // If accessed directly without state, redirect to cart
    useEffect(() => {
        if (!state || !state.cart || state.cart.length === 0) {
            navigate('/cart');
        }
    }, [state, navigate]);

    const { cart, subtotal, discount, tax, deliveryFee, total } = state || {
        cart: [], subtotal: 0, discount: 0, tax: 0, deliveryFee: 0, total: 0
    };

    const [formData, setFormData] = useState({
        name: user?.displayName || user?.name || '',
        email: user?.email || '',
        phone: user?.phonenumber || '',
        address: '', // Current selected or typed address
    });

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isNewAddress, setIsNewAddress] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch saved addresses
    useEffect(() => {
        if (user?.uid) {
            const fetchAddresses = async () => {
                const userRef = ref(database, `users/${user.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const addresses = [];

                    // Backend structure check: 'addresses' list or single 'address' field?
                    // We support both for backward compatibility
                    if (userData.addresses) {
                        Object.entries(userData.addresses).forEach(([key, val]) => {
                            addresses.push({ id: key, address: val });
                        });
                    }

                    // If there's a legacy single address and it's not in the list, add it
                    if (userData.address && !addresses.find(a => a.address === userData.address)) {
                        addresses.push({ id: 'default', address: userData.address });
                    }

                    setSavedAddresses(addresses);

                    // Auto-select the first one if available
                    if (addresses.length > 0) {
                        setSelectedAddressId(addresses[0].id);
                        setFormData(prev => ({ ...prev, address: addresses[0].address }));
                    } else {
                        setIsNewAddress(true); // No addresses, force add new
                    }
                }
            };
            fetchAddresses();
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id);
        if (id === 'new') {
            setIsNewAddress(true);
            setFormData(prev => ({ ...prev, address: '' }));
        } else {
            setIsNewAddress(false);
            const addr = savedAddresses.find(a => a.id === id);
            if (addr) {
                setFormData(prev => ({ ...prev, address: addr.address }));
            }
        }
    };

    const [paymentMethod, setPaymentMethod] = useState('UPI');

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            toast.error("Please fill in all details");
            return;
        }

        setLoading(true);

        try {
            // 1. Save new address if applicable
            if (user?.uid && isNewAddress) {
                const addressRef = ref(database, `users/${user.uid}/addresses`);
                const newAddressRef = push(addressRef);
                await set(newAddressRef, formData.address);

                const userRef = ref(database, `users/${user.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists() && !snapshot.val().address) {
                    await update(userRef, { address: formData.address });
                }
            }

            // 2. Create Order
            const ordersRef = ref(database, 'orders');
            const newOrderRef = push(ordersRef);
            const orderId = newOrderRef.key;
            const orderDate = new Date().toISOString();

            const orderData = {
                orderId: orderId,
                userId: user?.uid || 'guest',
                userDetails: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address
                },
                items: cart,
                amountHighlights: {
                    subtotal,
                    discount,
                    tax,
                    deliveryFee,
                    total
                },
                totalAmount: total,
                status: 'Placed',
                orderDate: orderDate,
                paymentMethod: paymentMethod
            };

            await set(newOrderRef, orderData);

            // 3. Create Payment Record
            const paymentsRef = ref(database, 'payments');
            const newPaymentRef = push(paymentsRef);

            const paymentData = {
                transactionId: newPaymentRef.key,
                orderId: orderId,
                userDetails: {
                    name: formData.name,
                    email: formData.email
                },
                totalAmount: total,
                paymentMode: paymentMethod, // 'UPI' or 'Card'
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                timestamp: orderDate,
                status: 'Success' // Assuming immediate success for this flow
            };

            await set(newPaymentRef, paymentData);

            // 4. Clear Cart and Redirect
            clearCart();
            toast.success("Order placed successfully!");
            navigate('/payment-success', {
                state: {
                    cart,
                    subtotal,
                    discount,
                    tax,
                    deliveryFee,
                    total: total,
                    orderId: orderId
                }
            });

        } catch (error) {
            console.error(error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#FFF8E7] py-10 font-[Poppins]">
            <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-[#F28C28] mb-6 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Cart
                </button>

                <h1 className="text-3xl font-bold text-[#2E2E2E] mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:w-2/3">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#F28C28] text-white flex items-center justify-center text-sm">1</span>
                                Contact Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none bg-gray-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none bg-gray-50"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#F28C28] text-white flex items-center justify-center text-sm">2</span>
                                Delivery Address
                            </h2>

                            {/* Saved Addresses List */}
                            {savedAddresses.length > 0 && (
                                <div className="space-y-4 mb-6">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => handleAddressSelect(addr.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${selectedAddressId === addr.id ? 'border-[#F28C28] bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                                        >
                                            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${selectedAddressId === addr.id ? 'border-[#F28C28] bg-[#F28C28]' : 'border-gray-300'}`}>
                                                {selectedAddressId === addr.id && <FaCheckCircle className="text-white text-xs" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-medium">{addr.address}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add New Address Option */}
                            <button
                                onClick={() => handleAddressSelect('new')}
                                className={`flex items-center gap-2 font-semibold transition-colors mb-4 ${selectedAddressId === 'new' ? 'text-[#F28C28]' : 'text-gray-500 hover:text-[#F28C28]'}`}
                            >
                                <FaPlus /> Add New Address
                            </button>

                            {/* New Address Input */}
                            {(isNewAddress || savedAddresses.length === 0) && (
                                <div className="animate-fadeIn">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Details</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full street address..."
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] outline-none bg-gray-50 resize-none"
                                        required
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-[#F28C28]/10 sticky top-24">
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{item.quantity}x</span>
                                            <span className="text-gray-800 line-clamp-1">{item.title || item.name}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 my-4"></div>

                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Discount</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center text-xl font-bold text-[#2E2E2E] mb-8">
                                <span>Total</span>
                                <span className="text-[#F28C28]">₹{total.toFixed(2)}</span>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-700 mb-2">Payment Method</h4>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('UPI')}
                                        className={`flex-1 py-2 rounded-xl border-2 font-medium transition-all ${paymentMethod === 'UPI' ? 'border-[#F28C28] bg-orange-50 text-[#F28C28]' : 'border-gray-100 text-gray-500'}`}
                                    >
                                        UPI / Online
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('Card')}
                                        className={`flex-1 py-2 rounded-xl border-2 font-medium transition-all ${paymentMethod === 'Card' ? 'border-[#F28C28] bg-orange-50 text-[#F28C28]' : 'border-gray-100 text-gray-500'}`}
                                    >
                                        Credit/Debit Card
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full py-4 bg-[#F28C28] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#F28C28]/30 hover:bg-[#d9741e] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
