import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ChefProfile = () => {
    // Dummy user data
    const [user, setUser] = useState({
        name: 'Chef Sanjeev',
        email: 'sanjeev@kitchen.com',
        phonenumber: '9876543210',
        speciality: 'North Indian, Mughlai',
        experience: '10 Years',
        role: 'chef'
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: user
    });

    const [isEditing, setIsEditing] = useState(false);

    const onSubmit = (data) => {
        console.log("Updated Profile:", data);
        setUser({ ...user, ...data });
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    return (
        <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-orange-100 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                            <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {user.role}
                            </span>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 font-medium transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="form-group">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                                    <input
                                        type="text"
                                        {...register("name", { required: "Name is required" })}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        {...register("phonenumber", { required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Valid 10 digit number" } })}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    />
                                    {errors.phonenumber && <p className="text-red-500 text-xs mt-1">{errors.phonenumber.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                                    <input
                                        type="email"
                                        {...register("email", { required: "Email is required" })}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Speciality</label>
                                    <input
                                        type="text"
                                        {...register("speciality")}
                                        placeholder="e.g. Italian, Mexican"
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Experience</label>
                                    <input
                                        type="text"
                                        {...register("experience")}
                                        placeholder="e.g. 5 Years"
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditing(false); }}
                                    className="px-6 py-2 rounded-xl text-gray-500 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-sm transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email</label>
                                <p className="text-gray-700 font-medium text-lg">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Phone</label>
                                <p className="text-gray-700 font-medium text-lg">{user.phonenumber}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Speciality</label>
                                <p className="text-gray-700 font-medium text-lg">{user.speciality || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Experience</label>
                                <p className="text-gray-700 font-medium text-lg">{user.experience || '-'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChefProfile;
