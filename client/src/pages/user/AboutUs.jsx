import React from 'react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#FFF8E7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[#2E2E2E] sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Our Story at Payal's Kitchen
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                        Serving happiness, one plate at a time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image Section (Placeholder/Abstract) */}
                    <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 h-96 bg-orange-100 flex items-center justify-center">
                        <img src="./images/img5.png" alt="" srcset="" className='w-full h-full object-contain' />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#2E2E2E]">
                            Passion for Authentic Flavors
                        </h2>
                        <p className="text-lg text-gray-600">
                            Welcome to Payal's Kitchen, where culinary tradition meets modern comfort. Started with a simple dream of sharing homemade warmth, we have grown into a community favorite for authentic, delicious meals.
                        </p>
                        <p className="text-lg text-gray-600">
                            We believe that food is more than just sustenance; it's an experience that brings people together. Our chefs use only the freshest locally-sourced ingredients to craft dishes that taste like home.
                        </p>

                        <div className="pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-[#F28C28]/10">
                                    <h3 className="text-xl font-semibold text-[#F28C28]">Fresh Ingredients</h3>
                                    <p className="text-gray-600">Farm-to-table freshness daily.</p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-[#F28C28]/10">
                                    <h3 className="text-xl font-semibold text-[#F28C28]">Made with Love</h3>
                                    <p className="text-gray-600">Authentic recipes, zero compromise.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
