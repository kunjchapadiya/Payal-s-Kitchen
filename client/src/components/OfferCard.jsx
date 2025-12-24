import React from "react";

const OfferCard = ({ title = "Special Offer", description = "Get a discount on your order", code = "WELCOME", onCopy }) => {
    return (
        <div className="w-full max-w-sm mx-auto font-[Poppins]">
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#F28C28]/20 group h-full flex flex-col justify-between">

                {/* Background Decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F28C28]/10 rounded-full blur-2xl group-hover:bg-[#F28C28]/20 transition-all duration-500"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#F28C28]/10 rounded-full blur-2xl group-hover:bg-[#F28C28]/20 transition-all duration-500"></div>

                <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                    <div>
                        {/* Title Badge */}
                        <div className="flex justify-start mb-4">
                            <span className="bg-[#FFF8E7] text-[#F28C28] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#F28C28]/20">
                                Special Offer
                            </span>
                        </div>

                        {/* Main Content */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-[#2E2E2E] mb-2 group-hover:text-[#F28C28] transition-colors break-words">
                                {title}
                            </h1>
                            <p className="text-gray-500 text-sm mb-4 break-words">
                                {description}
                            </p>

                            {/* Coupon Code */}
                            <div className="bg-[#FFF8E7] border-2 border-dashed border-[#F28C28]/40 rounded-xl p-3 transform group-hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => {
                                if (navigator.clipboard && code) {
                                    navigator.clipboard.writeText(code);
                                    if (onCopy) onCopy();
                                }
                            }}>
                                <p className="text-xs text-gray-500 mb-1">USE COUPON CODE</p>
                                <p className="text-xl font-bold text-[#F28C28] tracking-widest font-mono select-all break-all">
                                    {code}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-4">
                        <button className="w-full bg-[#F28C28] hover:bg-[#E07B17] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-[#F28C28]/20 hover:shadow-[#F28C28]/40 transform active:scale-95 transition-all duration-200 cursor-pointer">
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferCard;