import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#2E2E2E] text-white pt-16 pb-8 font-[Poppins] border-t-4 border-[#F28C28]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#F28C28] to-[#FFB74D] bg-clip-text text-transparent">
                            Payal's Kitchen
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Serving delicious, homemade meals with love. Your health and taste are our top priority. Experience the joy of authentic cooking delivered to your doorstep.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#F28C28] rounded-full"></span> Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Subscription Plan', path: '/plan' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Order Now', path: '/order' },
                                { name: 'Contact Us', path: '/contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className="text-gray-300 hover:text-[#F28C28] transition-colors duration-300 text-sm flex items-center gap-2 group w-fit"
                                    >
                                        <span className="w-1.5 h-1.5 bg-[#F28C28] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#F28C28] rounded-full"></span> Our Services
                        </h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="hover:text-[#F28C28] transition-colors cursor-pointer w-fit">Daily Tiffin Service</li>
                            <li className="hover:text-[#F28C28] transition-colors cursor-pointer w-fit">Event Catering</li>
                            <li className="hover:text-[#F28C28] transition-colors cursor-pointer w-fit">Corporate Lunches</li>
                            <li className="hover:text-[#F28C28] transition-colors cursor-pointer w-fit">Custom Meal Plans</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#F28C28] rounded-full"></span> Contact Us
                        </h3>
                        <div className="space-y-5 text-gray-300 text-sm">
                            <p className="flex items-start gap-3">
                                <div className="bg-[#3E3E3E] p-2 rounded-full text-[#F28C28]">
                                    <FaMapMarkerAlt size={14} />
                                </div>
                                <span className="mt-1">Navarangpura, Ahmedabad, Gujarat, India 380001</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <div className="bg-[#3E3E3E] p-2 rounded-full text-[#F28C28]">
                                    <FaPhoneAlt size={14} />
                                </div>
                                <span>+91 98765 43210</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <div className="bg-[#3E3E3E] p-2 rounded-full text-[#F28C28]">
                                    <FaEnvelope size={14} />
                                </div>
                                <span>hello@payalskitchen.com</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} Payal's Kitchen. All rights reserved.
                    </p>

                    <div className="flex gap-4">
                        {[
                            { icon: FaFacebookF, href: "#" },
                            { icon: FaTwitter, href: "#" },
                            { icon: FaInstagram, href: "#" }
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                className="group w-10 h-10 rounded-full bg-[#3E3E3E] flex items-center justify-center text-gray-400 hover:bg-[#F28C28] hover:text-white transition-all duration-300 shadow-md hover:shadow-[#F28C28]/30"
                            >
                                <social.icon className="transform group-hover:scale-110 transition-transform duration-300" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
