import React from 'react';
import { BsCart4 } from "react-icons/bs";
import { FaCheck, FaStar } from "react-icons/fa";

const Subscription = () => {
    const plans = [
        {
            id: 1,
            title: "Weekly Trial",
            price: "₹800",
            duration: "/ week",
            features: [
                "5 Days Service (Mon-Fri)",
                "Standard Lunch Box",
                "No Customization",
                "Free Delivery"
            ],
            recommended: false
        },
        {
            id: 2,
            title: "Monthly Delight",
            price: "₹3000",
            duration: "/ month",
            features: [
                "22 Days Service",
                "Premium Lunch & Dinner options",
                "Semi-Customizable Menu",
                "Weekend Specials Included",
                "Free Delivery"
            ],
            recommended: true
        },
        {
            id: 3,
            title: "Quarterly Feast",
            price: "₹8500",
            duration: "/ 3 months",
            features: [
                "66 Days Service",
                "Complete Menu Customization",
                "Priority Delivery",
                "Guest Meal Passes (2/mo)",
                "Dietician Consultation"
            ],
            recommended: false
        }
    ];

    return (
        <section className="bg-[#FFF8E7] min-h-screen py-20 font-[Poppins] relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F28C28]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F28C28]/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[#F28C28] font-bold tracking-wider uppercase text-sm bg-[#F28C28]/10 px-4 py-1.5 rounded-full">
                        Pricing Plans
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-[#2E2E2E] mt-4 mb-6">
                        Choose Your <span className="text-[#F28C28]">Perfect Plan</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Flexible meal plans designed to fit your lifestyle. Healthy, home-cooked meals delivered right to your doorstep.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 ${plan.recommended ? 'border-[#F28C28]' : 'border-transparent'}`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F28C28] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                    <FaStar size={12} /> Best Value
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-[#2E2E2E] mb-2">{plan.title}</h3>
                                <div className="flex items-end justify-center gap-1 text-[#F28C28]">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                    <span className="text-gray-500 font-medium mb-1">{plan.duration}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[20px] text-[#F28C28]">
                                            <FaCheck size={16} />
                                        </div>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${plan.recommended
                                    ? 'bg-[#F28C28] text-white hover:bg-[#d9741e]'
                                    : 'bg-[#FFF8E7] text-[#F28C28] hover:bg-[#F28C28] hover:text-white'
                                }`}>
                                <BsCart4 size={20} />
                                Subscribe Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Subscription;