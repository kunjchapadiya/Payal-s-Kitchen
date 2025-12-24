import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const onSubmit = async (data) => {
        setIsLoading(true);
        const result = await login(data.email, data.password);

        if (result.success) {
            toast.success('Login successful!');

            // Check if there's a return url
            const from = location.state?.from?.pathname;

            if (from) {
                navigate(from, { replace: true });
            } else {
                // Redirect based on the role fetched during login
                let redirectPath = '/';
                if (result.role === 'admin') redirectPath = '/admin';
                else if (result.role === 'chef') redirectPath = '/chef';

                navigate(redirectPath);
            }
        } else {
            if (result.needsVerification) {
                toast.warning(result.error);
            } else {
                toast.error(result.error);
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 md:p-6 bg-[#FFF8E7]">
            <div className="w-full max-w-5xl h-full md:h-[80vh] flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white relative z-20">
                    <div className="max-w-md mx-auto w-full space-y-8">
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                                Welcome <span className="text-orange-600">Back</span>
                            </h1>
                            <p className="text-gray-500 text-lg">Please enter your details to sign in.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-5">
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

                                <div>
                                    <div className="flex items-center justify-between mb-1.5 ml-1">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        className={`w-full px-5 py-3.5 rounded-xl bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'
                                            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 font-medium`}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner size="sm" color="white" />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-2">
                            <p className="text-gray-500">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                    Register now
                                </Link>
                            </p>
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
                            <h3 className="text-2xl font-bold text-gray-800">Delicious Meals Await</h3>
                            <p className="text-gray-500">Order your favorites and enjoy home-style cooking.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;