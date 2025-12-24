import React, { useState } from 'react';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaTag } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore'; // Zustand
import { database } from '../../../firebase';
import { ref, get } from 'firebase/database';
import { toast } from 'react-toastify';


const Cart = () => {
    const navigate = useNavigate();

    // Destructure from Zustand store
    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getCartSubTotal = useCartStore((state) => state.getCartSubTotal);
    const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);

    // Promo Code State
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [isCheckingPromo, setIsCheckingPromo] = useState(false);

    const subtotal = getCartSubTotal();
    const deliveryFee = getDeliveryFee(subtotal);
    // Tax is 5% of subtotal after discount
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxRate = 0.05;
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax + deliveryFee;

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            toast.error("Please enter a promo code");
            return;
        }
        setIsCheckingPromo(true);
        try {
            const offersRef = ref(database, 'offers');
            const snapshot = await get(offersRef);
            if (snapshot.exists()) {
                const offers = snapshot.val();
                // Find matching active offer
                const offerArray = Object.values(offers);
                const match = offerArray.find(
                    (offer) =>
                        offer.code.toLowerCase() === promoCode.toLowerCase() &&
                        offer.status === 'Active'
                );

                if (match) {
                    // Check expiry
                    const expiryDate = new Date(match.expiryDate);
                    const today = new Date();
                    if (expiryDate < today) {
                        toast.error("This promo code has expired");
                    } else {
                        // Calculate discount
                        // Assuming discount is a percentage
                        const discountVal = (subtotal * match.discount) / 100;
                        setDiscount(discountVal);
                        setAppliedPromo(match);
                        toast.success(`Promo code applied! You saved ₹${discountVal.toFixed(2)}`);
                    }
                } else {
                    toast.error("Invalid promo code");
                    setDiscount(0);
                    setAppliedPromo(null);
                }
            } else {
                toast.error("No offers available at the moment");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to apply promo code");
        } finally {
            setIsCheckingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setDiscount(0);
        setAppliedPromo(null);
        setPromoCode('');
        toast.info("Promo code removed");
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FFF8E7] font-[Poppins]">
                <div className="bg-white p-8 rounded-3xl shadow-lg text-center border-2 border-[#F28C28]/10 max-w-md mx-4">
                    <img src="/images/empty-cart.png" alt="Empty Cart" className="w-48 h-48 mx-auto mb-6 opacity-80" onError={(e) => e.target.style.display = 'none'} />
                    <h2 className="text-3xl font-bold text-[#2E2E2E] mb-3">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any delicious meals yet!</p>
                    <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-3 bg-[#F28C28] text-white rounded-full font-semibold hover:bg-[#d9741e] transition-colors shadow-lg shadow-[#F28C28]/20">
                        Browse Menu <FaArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-[#FFF8E7] min-h-screen py-10 font-[Poppins]">
            <div className="container mx-auto px-4 lg:px-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#2E2E2E] mb-8 flex items-center gap-3">
                    Your <span className="text-[#F28C28]">Cart</span>
                    <span className="text-base font-normal text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                        {cart.length} items
                    </span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List - Left Side */}
                    <div className="lg:w-2/3 space-y-6">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-6 group">
                                {/* Product Image */}
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image || "/images/img1.png"}
                                        alt={item.title || item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-1">{item.title || item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3">Unit Price: ₹{item.price}</p>
                                    <h4 className="text-xl font-bold text-[#F28C28]">₹{(item.price * item.quantity).toFixed(2)}</h4>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                    {/* Quantity Toggle */}
                                    <div className="flex items-center bg-[#FFF8E7] rounded-full p-1 border border-[#F28C28]/20">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#2E2E2E] shadow-sm hover:text-[#F28C28] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-[#2E2E2E]">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= 10}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F28C28] text-white shadow-sm hover:bg-[#d9741e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                        title="Remove Item"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bill Segment - Right Side */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-[#F28C28]/10 sticky top-24">
                            <h3 className="text-2xl font-bold text-[#2E2E2E] mb-6">Order Summary</h3>

                            {/* Promo Code Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                                {appliedPromo ? (
                                    <div className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <FaTag className="text-green-600" />
                                            <span className="font-bold text-green-700">{appliedPromo.code}</span>
                                        </div>
                                        <button onClick={handleRemovePromo} className="text-xs text-red-500 hover:underline font-semibold">Remove</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 bg-gray-50"
                                        />
                                        <button
                                            onClick={handleApplyPromo}
                                            disabled={isCheckingPromo}
                                            className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-70"
                                        >
                                            {isCheckingPromo ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Discount</span>
                                        <span className="font-semibold">- ₹{discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Tax (5%)</span>
                                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Delivery Fee</span>
                                    {deliveryFee === 0 ? (
                                        <span className="font-semibold text-green-600">Free</span>
                                    ) : (
                                        <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                                    )}
                                </div>
                                {subtotal <= 200 && subtotal > 0 && (
                                    <p className="text-xs text-orange-500 mt-1">Add items worth ₹{(201 - subtotal).toFixed(0)} more for free delivery!</p>
                                )}

                                <div className="my-4 border-t-2 border-dashed border-gray-100"></div>
                                <div className="flex justify-between items-center text-xl font-bold text-[#2E2E2E]">
                                    <span>Total</span>
                                    <span className="text-[#F28C28]">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-[#F28C28] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#F28C28]/30 hover:bg-[#d9741e] hover:-translate-y-1 transition-all duration-300" onClick={() => {
                                navigate('/checkout', { state: { cart, subtotal, discount, tax, deliveryFee, total } });
                            }}>
                                Proceed to Checkout
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                * Prices are inclusive of all applicable taxes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
