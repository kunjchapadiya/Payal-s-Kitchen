import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuth();
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        const result = await resetPassword(data.email);

        if (result.success) {
            toast.success('Password reset email sent!');
            setEmailSent(true);
        } else {
            toast.error(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 md:p-6 bg-[#FFF8E7]">
            <div className="w-full max-w-5xl h-full md:h-[80vh] flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white relative z-20">
                    <div className="max-w-md mx-auto w-full space-y-8">
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                                Forgot <span className="text-orange-600">Password?</span>
                            </h1>
                            <p className="text-gray-500 text-lg">
                                {emailSent
                                    ? "Check your email for reset instructions."
                                    : "Enter your email to reset your password."}
                            </p>
                        </div>

                        {!emailSent ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className={`w-full px-5 py-3.5 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'
                                            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 font-medium`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner size="sm" color="white" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">
                                <p className="font-medium text-center">
                                    We've sent a password reset link to your email address. Please check your inbox and spam folder.
                                </p>
                            </div>
                        )}

                        <div className="text-center pt-2">
                            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Side - Visual */}
                <div className="w-full md:w-1/2 bg-orange-50/30 relative flex items-center justify-center p-8 md:p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4]"></div>
                    <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                        <div className="w-full h-80 md:h-96 relative">
                            <DotLottieReact
                                src="/lottie/Chef.lottie"
                                loop
                                autoplay
                                className="w-full h-full drop-shadow-2xl"
                            />
                        </div>
                        <div className="text-center mt-6 space-y-2">
                            <h3 className="text-2xl font-bold text-gray-800">Secure & Simple</h3>
                            <p className="text-gray-500">Recover your account and get back to delicious meals.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;
