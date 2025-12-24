import React, { useEffect, useState } from 'react';
import { FaUtensils, FaArrowRight } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Features from '../../components/Features';
import FoodCard from '../../components/FoodCard';
import OfferCard from '../../components/OfferCard';
import { useNavigate } from 'react-router-dom';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

const Home = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [offers, setOffers] = useState([]);
    const [randomMenu, setRandomMenu] = useState([]);

    useEffect(() => {
        // Fetch Reviews (Feedback)
        const feedbackRef = ref(database, 'feedback');
        const unsubscribeFeedback = onValue(feedbackRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedReviews = Object.values(data)
                    .filter(item => item.rating === 5) // Only 5-star reviews
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
                    .slice(0, 3); // Take top 3
                setReviews(fetchedReviews);
            } else {
                setReviews([]);
            }
        });

        // Fetch Offers
        const offersRef = ref(database, 'offers');
        const unsubscribeOffers = onValue(offersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const activeOffers = Object.values(data).filter(o => o.status === 'Active' || o.isActive === true);
                setOffers(activeOffers);
            } else {
                setOffers([]);
            }
        });

        // Fetch Menu Items
        const menuRef = ref(database, 'menuItems');
        const unsubscribeMenu = onValue(menuRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const allItems = Object.entries(data).map(([id, value]) => ({ id, ...value }));
                // Shuffle array using Fisher-Yates or simple sort
                const shuffled = [...allItems].sort(() => 0.5 - Math.random());
                // Get top 4
                setRandomMenu(shuffled.slice(0, 4));
            } else {
                setRandomMenu([]);
            }
        });

        return () => {
            unsubscribeFeedback();
            unsubscribeOffers();
            unsubscribeMenu();
        };
    }, []);

    return (
        <>
            <section className="relative w-full bg-[#FFF8E7] min-h-[90vh] flex items-center overflow-hidden font-[Poppins]">

                {/* Background Decorative Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F28C28]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F28C28]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center relative z-10">

                    {/* Left Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 bg-[#F28C28]/10 text-[#d9741e] font-semibold rounded-full text-sm mb-2 hover:bg-[#F28C28]/20 transition-colors cursor-default">
                            👋 Welcome to Payal's Kitchen
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-extrabold text-[#2E2E2E] leading-tight">
                            Experience the Joy of <span className="text-[#F28C28]">Authentic</span> Home Cooking
                        </h1>

                        <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Payal's Kitchen specializes in providing delicious, healthy, and fresh meals. From handcrafted pastas to wholesome salads, we bring the taste of home directly to your table using only the finest ingredients.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/menu" className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#F28C28] text-white rounded-full font-semibold shadow-lg shadow-[#F28C28]/30 hover:bg-[#d9741e] hover:-translate-y-1 transition-all duration-300" onClick={() => navigate("/cart")}>
                                Order Now
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link to="/subscription" className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#2E2E2E] border-2 border-[#2E2E2E]/10 rounded-full font-semibold hover:border-[#F28C28] hover:text-[#F28C28] hover:-translate-y-1 transition-all duration-300">
                                <FaUtensils />
                                View Plans
                            </Link>
                        </div>

                        {/* Stats or Trust Badges */}
                        <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#2E2E2E]/10">
                            <div>
                                <h4 className="text-2xl font-bold text-[#2E2E2E]">500+</h4>
                                <p className="text-sm text-gray-500">Happy Customers</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#2E2E2E]">50+</h4>
                                <p className="text-sm text-gray-500">Daily Dishes</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#2E2E2E]">100%</h4>
                                <p className="text-sm text-gray-500">Fresh Ingredients</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-full flex justify-center lg:justify-end">
                        {/* Circle Background behind image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-[#F28C28] rounded-full opacity-10 ml-[120px] mt-[15px]"></div>

                        <img
                            src="/images/cook.png"
                            alt="Delicious Cooking"
                            className="relative z-10 w-full max-w-[500px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                </div>
            </section>

            <Features />

            {/* Menu Section */}
            <section className='bg-white py-20 font-[Poppins] relative z-20'>
                <div className="container mx-auto px-6 lg:px-12">

                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <span className="text-[#F28C28] font-bold tracking-wider uppercase text-sm bg-[#F28C28]/10 px-4 py-1.5 rounded-full">
                            Fresh & Hot
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-extrabold text-[#2E2E2E] mt-4 mb-4">
                            Today's <span className="text-[#F28C28]">Menu</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-[#F28C28] rounded-full mx-auto"></div>
                    </div>

                    {/* Food Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                        {randomMenu.length > 0 ? (
                            randomMenu.map((item, index) => (
                                <FoodCard
                                    key={index}
                                    name={item.name}
                                    price={item.price}
                                    image={item.image}
                                    description={item.description}
                                    id={item.id}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-gray-500">Loading today's specials...</div>
                        )}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/menu" className="inline-flex items-center gap-2 text-[#2E2E2E] font-semibold hover:text-[#F28C28] transition-colors border-b-2 border-[#2E2E2E] hover:border-[#F28C28] pb-1">
                            View Full Menu <FaArrowRight size={14} />
                        </Link>
                    </div>

                </div>
            </section>

            {/* Exclusive Offers Section */}
            <section className="py-20 bg-orange-50 font-[Poppins]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[#F28C28] font-bold tracking-wider uppercase text-sm bg-[#F28C28]/10 px-4 py-1.5 rounded-full">
                            Deals
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-extrabold text-[#2E2E2E] mt-4 mb-4">
                            Exclusive <span className="text-[#F28C28]">Offers</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-[#F28C28] rounded-full mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.length > 0 ? (
                            offers.map((offer, index) => (
                                <OfferCard
                                    key={index}
                                    title={offer.title}
                                    description={offer.description}
                                    code={offer.code}
                                    onCopy={() => toast.success("Code copied!")}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 py-8">
                                No active offers at the moment. Stay tuned!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-[#FFF8E7] py-20 font-[Poppins] relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F28C28]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F28C28]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    {/* Header Section matching the reference image layout */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                        <div className="lg:w-1/2">
                            <span className="inline-block px-4 py-1.5 bg-[#F28C28] text-white font-bold text-xs tracking-wider uppercase rounded-full mb-4">
                                What They Say
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#2E2E2E] leading-tight">
                                Real Reviews from <br className="hidden lg:block" />
                                Real <span className="text-[#F28C28]">Flavor Fans</span>
                            </h2>
                        </div>
                        <div className="lg:w-1/3">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Don't just take our word for it. Here's what our happy customers have to say about their daily meals and catering experiences with Payal's Kitchen.
                            </p>
                        </div>
                    </div>

                    {/* Reviews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-[#F28C28]/10 flex flex-col justify-between">
                                    <div>
                                        <div className="flex gap-1 text-[#F28C28] mb-6">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                            ))}
                                        </div>
                                        <h4 className="text-xl font-bold text-[#2E2E2E] mb-3">"Delicious!"</h4>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                        <div>
                                            <h5 className="font-bold text-[#2E2E2E]">{review.userName || "Customer"}</h5>
                                            <span className="text-sm text-gray-500">{review.userRole || "Verified User"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500 py-10">
                                No reviews yet. Be the first to rate us!
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;