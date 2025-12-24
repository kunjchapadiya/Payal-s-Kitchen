import React from "react";
import { FaFire, FaShippingFast, FaLeaf, FaBoxOpen } from "react-icons/fa";

const Features = () => {
    const features = [
        {
            id: 1,
            icon: <FaFire size={28} />,
            title: "Freshly Cooked",
            desc: "Every meal is prepared fresh daily using high-quality authentic ingredients.",
        },
        {
            id: 2,
            icon: <FaShippingFast size={28} />,
            title: "Fast Delivery",
            desc: "We ensure your food reaches you hot and on time, right to your doorstep.",
        },
        {
            id: 3,
            icon: <FaLeaf size={28} />,
            title: "Healthy & Natural",
            desc: "No preservatives, just pure wholesome goodness for your health.",
        },
        {
            id: 4,
            icon: <FaBoxOpen size={28} />,
            title: "Smart Packaging",
            desc: "Hygienic, spill-proof, and eco-friendly packaging for a mess-free experience.",
        },
    ];

    return (
        <section className="bg-[#F28C28] py-16 font-[Poppins] text-white relative z-20">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-[#F28C28]">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`flex flex-col items-center text-center px-6 relative group ${index !== features.length - 1
                                ? "lg:border-r lg:border-dashed lg:border-white/40"
                                : ""
                                }`}
                        >
                            {/* Icon Circle */}
                            <div
                                className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 
                              transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#F28C28]"
                            >
                                {feature.icon}
                            </div>

                            {/* Text */}
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
