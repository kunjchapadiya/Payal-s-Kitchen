import React from 'react';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';

import useCartStore from '../store/cartStore';

const FoodCard = ({
    name = "Special Idli Fry",
    price = "100",
    image = "/images/img1.png",
    description = "",
    id,
    ...props
}) => {
    // const { addToCart } = useCart(); // Old Context
    const addToCart = useCartStore((state) => state.addToCart); // New Zustand

    const handleAddToCart = () => {
        addToCart({ id, name, price, image, description, ...props });
    };

    return (
        <div className="w-full max-w-sm bg-white rounded-[2rem] p-4 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#F28C28]/10 transition-all duration-300 border border-gray-100 group relative overflow-hidden font-[Poppins]">

            {/* Veg Indicator */}
            <div className="absolute top-6 right-6 z-10 bg-white p-1 rounded shadow-sm">
                <img src="/images/veg-sign.png" alt="Veg" className="w-4 h-4" />
            </div>

            {/* Image Section */}
            <div className="h-56 w-full flex items-center justify-center relative overflow-hidden rounded-3xl bg-[#FFF8E7] group-hover:bg-[#FFF3D6] transition-colors duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] opacity-50"></div>
                <img
                    src={image}
                    alt={name}
                    className="h-44 w-auto object-contain drop-shadow-xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 relative z-10"
                />

            </div>

            {/* Content Section */}
            <div className="pt-5 px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#2E2E2E] line-clamp-1">{name}</h3>
                    {/* <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg">
                        <span className="text-xs font-bold text-green-700">{rating}</span>
                        <FaStar className="text-green-600 text-[10px]" />
                    </div> */}
                </div>

                <p className="text-sm text-gray-500 font-medium bg-gray-50 inline-block px-2 py-1 rounded-lg mb-4">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Price</span>
                        <span className="text-2xl font-extrabold text-[#2E2E2E]">
                            <span className="text-[#F28C28]">₹</span>{price}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-3 rounded-xl border-2 border-[#F28C28]/20 text-[#F28C28] hover:bg-[#FFF8E7] hover:border-[#F28C28] transition-colors"
                            onClick={handleAddToCart}>
                            <FaShoppingCart size={18} />
                        </button>
                        <button className="px-6 py-3 bg-[#F28C28] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#F28C28]/30 hover:bg-[#d9741e] hover:-translate-y-0.5 transition-all active:scale-95 duration-200"
                            onClick={handleAddToCart}
                        >
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default FoodCard;