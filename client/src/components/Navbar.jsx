import React, { useRef, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUtensils, FaBars, FaTimes } from "react-icons/fa";
import { IoBagHandleOutline } from "react-icons/io5";
import { MdLogin, MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
    const location = useLocation();
    const navRef = useRef([]);
    const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Subscription", path: "/subscription" },
        { name: "About Us", path: "/about" },
        { name: "Event Catering", path: "/order" },
        { name: "Contact Us", path: "/contact" },
        { name: "Profile", path: "/profile" },
    ];

    const handleAuthAction = async () => {
        if (isAuthenticated) {
            const { success, error } = await logout();
            if (success) {
                toast.success("Logged out successfully");
                navigate("/");
            } else {
                toast.error("Logout failed: " + error);
            }
        } else {
            navigate("/login");
        }
        setIsMenuOpen(false);
    }

    // 🔶 Move pill when route changes (Desktop only logic mainly, but benign on mobile)
    useEffect(() => {
        const activeIndex = navItems.findIndex(
            (item) => item.path === location.pathname
        );

        const el = navRef.current[activeIndex];
        if (el) {
            setPillStyle({
                width: el.offsetWidth + 20,
                left: el.offsetLeft - 10,
            });
        }
    }, [location.pathname]);

    return (
        <nav className="flex justify-between items-center py-4 px-6 bg-[#FFF8E7] shadow font-[Poppins] relative z-50">

            {/* Logo */}
            <h1 className="text-2xl font-bold text-[#F28C28] cursor-pointer" onClick={() => navigate('/')}>
                Payal's Kitchen
            </h1>

            {/* Hamburger Menu Icon (Mobile) */}
            <button
                className="md:hidden text-[#2E2E2E] focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>

            {/* DESKTOP NAV LINKS + SLIDER */}
            <div className="relative hidden md:block">
                <ul className="flex gap-6 relative">

                    {/* 🔶 Sliding Orange Glass Pill */}
                    <div
                        className="absolute top-0 bottom-0 bg-[#F28C28]/50 rounded-xl
                       backdrop-blur-md border border-white/20 transition-all duration-300"
                        style={{
                            width: pillStyle.width,
                            left: pillStyle.left,
                        }}
                    />

                    {navItems.map((item, index) => (
                        <li
                            key={item.name}
                            ref={(el) => (navRef.current[index] = el)}
                            className="relative z-10 px-3 py-1"
                        >
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `font-medium transition ${isActive ? "text-white" : "text-[#2E2E2E]"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* DESKTOP BUTTONS */}
            <div className="hidden md:flex items-center gap-4">

                <button onClick={() => navigate("/cart")}>
                    <IoBagHandleOutline size={24} className="hover:text-[#F28C28]" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded bg-[#F28C28] text-white font-medium hover:bg-[#d9741e] transition" onClick={() => navigate("/menu")}>
                    <FaUtensils size={18} />
                    View Menu
                </button>


                <button className="flex items-center gap-2 px-4 py-2 rounded border border-[#2E2E2E] text-[#2E2E2E]
                            hover:bg-[#2E2E2E] hover:text-white transition" onClick={handleAuthAction}>
                    {isAuthenticated ? <MdLogout size={20} /> : <MdLogin size={20} />}
                    {isAuthenticated ? "Logout" : "Login"}
                </button>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#FFF8E7] shadow-lg flex flex-col p-4 md:hidden border-t border-gray-100 animate-slide-in">
                    <ul className="flex flex-col gap-4 mb-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                            ? "bg-[#F28C28] text-white"
                                            : "text-[#2E2E2E] hover:bg-orange-50"
                                        }`
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                        <button
                            onClick={() => { navigate("/cart"); setIsMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-2 text-[#2E2E2E] hover:bg-orange-50 rounded-lg font-medium"
                        >
                            <IoBagHandleOutline size={22} />
                            Cart
                        </button>
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded bg-[#F28C28] text-white font-medium shadow-sm active:scale-95 transition"
                            onClick={() => { navigate("/menu"); setIsMenuOpen(false); }}
                        >
                            <FaUtensils size={18} />
                            View Menu
                        </button>
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded border border-[#2E2E2E] text-[#2E2E2E] font-medium active:scale-95 transition hover:bg-[#2E2E2E] hover:text-white"
                            onClick={handleAuthAction}
                        >
                            {isAuthenticated ? <MdLogout size={20} /> : <MdLogin size={20} />}
                            {isAuthenticated ? "Logout" : "Login"}
                        </button>
                    </div>
                </div>
            )}

        </nav>
    );
};

export default Navbar;
