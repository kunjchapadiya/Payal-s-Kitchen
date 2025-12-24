import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaArrowLeft, FaFileInvoice } from 'react-icons/fa';
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSucess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get order details from navigation state
    const { cart, subtotal, discount, tax, deliveryFee, total } = location.state || {
        cart: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0
    };

    // Calculate total items count (sum of quantities)
    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="w-full max-w-sm mx-auto font-[Poppins] my-20">
            <div className="bg-[#E7F8F0] rounded-3xl shadow-2xl overflow-hidden border border-green-200 relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/40 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-200/40 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10 p-6 pt-10">
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h1 className="text-3xl font-bold text-green-800 tracking-tight">Payment Success!</h1>
                        <p className="text-green-600 text-sm mt-1">Your order has been placed</p>
                        {
                            location.state?.orderId && (
                                <p className="text-gray-500 text-xs mt-1">Order ID: #{location.state.orderId}</p>
                            )
                        }
                    </div>

                    {/* Animation */}
                    <div className="h-40 w-full flex items-center justify-center -my-2">
                        <DotLottieReact
                            src="/lottie/success.lottie"
                            loop
                            autoplay
                            className="w-full h-full drop-shadow-lg"
                        />
                    </div>

                    {/* Receipt Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-green-100 mb-6">

                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-green-100">
                            <h3 className="text-sm font-semibold text-gray-700">Order Details</h3>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{totalItemsCount} Items</span>
                        </div>

                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                            {cart.length > 0 ? (
                                cart.map((item, index) => (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-800">
                                                {item.quantity} x
                                            </span>
                                            <span className="text-gray-800">
                                                {item.title || item.name}
                                            </span>
                                        </div>

                                        <span className="text-gray-900">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>

                                ))
                            ) : (
                                <div className="text-center text-gray-400 italic text-sm">No items details available</div>
                            )}
                        </div>

                        <div className="border-t border-dashed border-green-200 my-4"></div>

                        {/* Summary Details */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Tax (5%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between items-center text-xs text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-dashed border-green-200 my-4"></div>

                        <div className="flex justify-between items-center">
                            <p className="text-gray-500 text-sm font-medium">Total Amount</p>
                            <p className="text-xl font-bold text-green-700">₹{total.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-green-600/20 transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer" onClick={() => { navigate("/"); }}>
                            <FaArrowLeft className="text-sm" />
                            Back to Home
                        </button>

                        <button className="w-full bg-white hover:bg-green-50 text-green-700 font-semibold py-3.5 px-6 rounded-xl border border-green-200 shadow-sm transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer" onClick={() => { toast.success("Invoice sent to your email"); }}>
                            <FaFileInvoice className="text-sm" />
                            Get Invoice <span className="text-orange-500 font-bold ml-1">Gmail</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSucess;