import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Otp = () => {
    const { handleSubmit } = useForm();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on Backspace if empty
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const onSubmit = (data) => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length === 6) {
            console.log("OTP Submitted:", enteredOtp);
            // Simulate verification success
            setTimeout(() => {
                navigate("/login");
            }, 1000);

            navigate("/login");
        } else {
            alert("Please enter a valid 6-digit OTP.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 md:p-6 bg-[#FFF8E7]">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5 p-8 md:p-12">

                <div className="text-center space-y-4 mb-8">
                    <div className="mx-auto w-48 h-48">
                        <DotLottieReact
                            src="https://lottie.host/8026131c-b570-4966-9ed5-594b293845b7/J5nJ8o4n8b.lottie" // Placeholder OTP lottie or similar
                            loop
                            autoplay
                            className="w-full h-full"
                        />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Enter <span className="text-orange-600">OTP</span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        We have sent a verification code to your email.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex justify-center gap-2 md:gap-4">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={data}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-12 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-800 shadow-sm"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={otp.join("").length !== 6}
                            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-200
                                ${otp.join("").length === 6
                                    ? "bg-gradient-to-r from-orange-600 to-orange-500 shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01]"
                                    : "bg-gray-300 cursor-not-allowed"}`}
                        >
                            Verify OTP
                        </button>

                        <div className="text-center">
                            <p className="text-gray-500 text-sm">
                                Didn't receive code?{' '}
                                <button type="button" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                    Resend
                                </button>
                            </p>
                        </div>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Otp;
