import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { database } from '../../../firebase';
import { push, ref, set } from 'firebase/database';

const ContactUs = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or null
    const db = database;
    const onSubmit = (data) => {


        const contactsRef = ref(db, 'contacts');
        const newContactRef = push(contactsRef);
        set(newContactRef, {
            ...data,
            status: 'open',
            createdAt: new Date().toISOString()
        });
        toast.success("Complaint submitted successfully!");
        // Simulate API call
        setTimeout(() => {
            setFormStatus('success');
            reset();
            setTimeout(() => setFormStatus(null), 3000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#FFF8E7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[#2E2E2E] sm:text-5xl">
                        Get in Touch
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        We'd love to hear from you. Send us a review or an inquiry!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Contact Info Section */}
                    <div className="bg-[#F28C28] rounded-2xl p-8 sm:p-12 text-white shadow-xl">
                        <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <FaPhone className="w-6 h-6 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-lg">Phone</h4>
                                    <p>+91 123 456 7890</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <FaEnvelope className="w-6 h-6 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-lg">Email</h4>
                                    <p>hello@payalskitchen.com</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <FaMapMarkerAlt className="w-6 h-6 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-lg">Location</h4>
                                    <p>123 Food Street, Flavor Town, India</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-semibold text-lg mb-4">Opening Hours</h4>
                            <p>Mon - Fri: 9:00 AM - 10:00 PM</p>
                            <p>Sat - Sun: 10:00 AM - 11:00 PM</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#F28C28]/10">
                        <h3 className="text-2xl font-bold text-[#2E2E2E] mb-6">Send us a Message</h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            {/* Type selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <select
                                    {...register("type", { required: "Please select a subject" })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent transition-colors ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select an option</option>
                                    <option value="inquiry">General Inquiry</option>
                                    <option value="review">Food Review</option>
                                    <option value="catering">Catering Request</option>
                                </select>
                                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    {...register("message", { required: "Message is required", minLength: { value: 10, message: "Message must be at least 10 characters" } })}
                                    rows="4"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F28C28] focus:border-transparent transition-colors ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Tell us what you think..."
                                ></textarea>
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#F28C28] hover:bg-[#d9741e] text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-[1.02] active:scale-95 shadow-lg"
                            >
                                Send Message
                            </button>

                            {formStatus === 'success' && (
                                <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center font-medium animate-pulse">
                                    Thank you! Your message has been sent successfully.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
