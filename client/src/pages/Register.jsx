import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const Register = () => {
    const { register: registerUser, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register: firebaseRegister } = useAuth();

    // Watch password for confirmation validation
    const password = watch("password");

    const onSubmit = async (data) => {
        setIsLoading(true);
        const result = await firebaseRegister(data);

        if (result.success) {
            toast.success('Registration successful! Please check your email to verify your account.');
            navigate("/login");
        } else {
            toast.error(result.error);
        }
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 md:p-6 bg-[#FFF8E7]">
            <div className="w-full max-w-6xl h-full md:h-[85vh] flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">

                {/* Left Side - Visual */}
                <div className="w-full md:w-1/2 bg-orange-50/30 relative flex items-center justify-center p-8 md:p-12 order-first md:order-last lg:order-first">
                    <div className="absolute inset-0 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4]"></div>
                    <div className="relative z-10 w-full max-w-md">
                        <DotLottieReact
                            src="https://lottie.host/5a4414ba-2329-4d28-9056-6fb6307b8c69/X2NCsuTrSx.lottie"
                            loop
                            autoplay
                            className="w-full h-full drop-shadow-2xl"
                        />
                        <div className="text-center mt-8 space-y-2">
                            <h3 className="text-2xl font-bold text-gray-800">Join Our Kitchen</h3>
                            <p className="text-gray-500">Experience the taste of home with every meal.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white">
                    <div className="max-w-md mx-auto w-full space-y-8">
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                                Payal's <span className="text-orange-600">Kitchen</span>
                            </h1>
                            <p className="text-gray-500 text-lg">Create your account to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        {...registerUser("name", { required: "Name is required" })}
                                        className={`w-full px-5 py-3.5 rounded-xl bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'
                                            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 font-medium`}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        {...registerUser("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className={`w-full px-5 py-3.5 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'
                                            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 font-medium`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="9876543210"
                                        {...registerUser("phonenumber", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^\d{10}$/,
                                                message: "Please enter a valid 10-digit phone number"
                                            }
                                        })}
                                        className={`w-full px-5 py-3.5 rounded-xl bg-gray-50 border ${errors.phonenumber ? 'border-red-500' : 'border-gray-200'
                                            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 font-medium`}
                                    />
                                    {errors.phonenumber && <p className="text-red-500 text-sm mt-1 ml-1">{errors.phonenumber.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            {...registerUser("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters"
                                                }
                                            })}
                                            className={`w-full px-5 py-3.5 rounded-xl bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'
                                                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 font-medium`}
                                        />
                                        {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Confirm</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            {...registerUser("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: value => value === password || "Passwords do not match"
                                            })}
                                            className={`w-full px-5 py-3.5 rounded-xl bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                                                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 font-medium`}
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 ml-1">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    {...registerUser("terms", { required: "You must agree to the terms" })}
                                    className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 border-gray-300 cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                                    I agree to the <a href="#" className="font-semibold text-orange-600 hover:text-orange-700">Terms and Conditions</a>
                                </label>
                            </div>
                            {errors.terms && <p className="text-red-500 text-sm ml-1">{errors.terms.message}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner size="sm" color="white" />
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-2">
                            <p className="text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;