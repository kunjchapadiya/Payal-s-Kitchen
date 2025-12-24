import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCalendarAlt, FaUserFriends, FaGlassCheers, FaUtensils, FaCheckCircle } from 'react-icons/fa';
import { database } from '../../../firebase';
import { ref, push, set } from 'firebase/database';
import { toast } from 'react-toastify';

import { getAuth } from "firebase/auth";

const Catering = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [details, setDetails] = useState({});

    const onSubmit = (data) => {
        const auth = getAuth();
        const user = auth.currentUser;

        const formData = {
            ...data,
            status: "pending",
            createdAt: new Date().toISOString(),
            userId: user ? user.uid : "guest",
        };

        const cateringRef = ref(database, 'catering');
        const newCateringRef = push(cateringRef);
        set(newCateringRef, formData)
        toast.success("Catering Request Sent Successfully");
        console.log("Catering Request:", formData);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            reset();
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FFF8E7] font-sans pb-12">
            {/* Hero Section */}
            <div className="bg-[#F28C28]/10 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#F28C28] sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
                        Celebrate with Payal's Kitchen
                    </h1>
                    <p className="max-w-xl mx-auto text-xl text-gray-600">
                        From intimate gatherings to grand weddings, we bring the authentic taste of home to your special moments.
                    </p>
                </div>
                {/* Decorative background elements could go here */}
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-5 gap-10">

                {/* Information / value prop side */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#F28C28]">
                        <div className="flex items-center space-x-4 mb-3">
                            <div className="bg-[#F28C28]/10 p-3 rounded-full text-[#F28C28]">
                                <FaGlassCheers className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E]">Any Occasion</h3>
                        </div>
                        <p className="text-gray-600">
                            Birthdays, anniversaries, weddings, or corporate events. We curate menus to match the vibe.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#F28C28]">
                        <div className="flex items-center space-x-4 mb-3">
                            <div className="bg-[#F28C28]/10 p-3 rounded-full text-[#F28C28]">
                                <FaUtensils className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E]">Custom Menus</h3>
                        </div>
                        <p className="text-gray-600">
                            Customize your menu with our wide range of authentic Gujarati, North Indian, and fusion dishes.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#F28C28]">
                        <div className="flex items-center space-x-4 mb-3">
                            <div className="bg-[#F28C28]/10 p-3 rounded-full text-[#F28C28]">
                                <FaUserFriends className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E]">Seamless Service</h3>
                        </div>
                        <p className="text-gray-600">
                            Experience hassle-free catering with our professional team managing food setup and service.
                        </p>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#F28C28]/10">
                        <div className="px-8 py-6 bg-[#F28C28] text-white">
                            <h2 className="text-2xl font-bold">Book Your Event</h2>
                            <p className="opacity-90">Fill out the details below and we'll get back to you with a quote.</p>
                        </div>

                        <div className="p-8">
                            {isSubmitted ? (
                                <div className="text-center py-20">
                                    <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                                    <h3 className="text-3xl font-bold text-[#2E2E2E] mb-2">Request Sent!</h3>
                                    <p className="text-gray-600 text-lg">
                                        We have received your details. Our team will contact you shortly to finalize the menu.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                    {/* Row 1: Personal Types */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                {...register("fullName", { required: "Name is required" })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent outline-none transition ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                {...register("phone", {
                                                    required: "Phone is required",
                                                    pattern: { value: /^[0-9]{10}$/, message: "Valid 10-digit number required" }
                                                })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent outline-none transition ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                        </div>
                                    </div>

                                    {/* Row 2: Event Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                            <select
                                                {...register("eventType", { required: "Select event type" })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent outline-none transition ${errors.eventType ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select Occasion</option>
                                                <option value="birthday">Birthday Party</option>
                                                <option value="wedding">Marriage / Reception</option>
                                                <option value="corporate">Corporate Event</option>
                                                <option value="engagement">Engagement</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.eventType && <p className="text-red-500 text-xs mt-1">{errors.eventType.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count (Approx)</label>
                                            <input
                                                type="number"
                                                {...register("guestCount", { required: "Enter guest count", min: { value: 10, message: "Minimum 10 guests" } })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent outline-none transition ${errors.guestCount ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.guestCount && <p className="text-red-500 text-xs mt-1">{errors.guestCount.message}</p>}
                                        </div>
                                    </div>

                                    {/* Row 3: Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                {...register("eventDate", { required: "Date is required" })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent outline-none transition pl-10 ${errors.eventDate ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                        {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate.message}</p>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements / Menu Preferences</label>
                                        <textarea
                                            rows="3"
                                            {...register("requirements")}
                                            placeholder="E.g., Pure Veg, No Onion/Garlic options needed, specific dishes..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent outline-none transition"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#F28C28] hover:bg-[#d9741e] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                    >
                                        Request Quote
                                    </button>

                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catering;
