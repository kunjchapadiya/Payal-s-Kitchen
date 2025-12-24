import React, { useState, useEffect } from 'react';
import { PiChefHatDuotone } from "react-icons/pi";
import { FaPlus, FaTimes, FaSearch, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { database } from '../../../firebase';
import { ref, onValue, push, set, update, remove } from 'firebase/database';

const Chef = () => {
    const db = database;
    const [chef, setChef] = useState([]);
    const [addchef, setAddchef] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [editchef, setEditchef] = useState(false);
    const [currentChef, setCurrentChef] = useState(null);

    const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm();


    const filteredChefs = chef.filter(chef => {
        const matchesSearch = chef.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesStatus = filterStatus === 'All' || chef.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    // Fetch chefs from Firebase
    useEffect(() => {
        const usersRef = ref(db, 'users/');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert object to array and filter for role 'chef'
                const loadedChefs = Object.entries(data)
                    .map(([id, val]) => ({ id, ...val }))
                    .filter(user => user.role === 'chef');
                setChef(loadedChefs);
            } else {
                setChef([]);
            }
        });
    }, [db]);

    // Prefill form when editing
    useEffect(() => {
        if (currentChef) {
            resetEdit(currentChef);
        }
    }, [currentChef, resetEdit]);



    const onAddSubmit = (data) => {
        const newChefRef = push(ref(db, 'users/'));
        set(newChefRef, {
            ...data,
            role: 'chef',
            status: data.status || 'Active'
        })
            .then(() => {
                setAddchef(false);
                resetAdd();
                toast.success('Chef added successfully');
            })
            .catch((error) => {
                console.error("Error adding chef:", error);
            });
    };

    const onEditSubmit = (data) => {
        if (currentChef?.id) {
            const chefRef = ref(db, `users/${currentChef.id}`);
            update(chefRef, data)
                .then(() => {
                    setEditchef(false);
                    setCurrentChef(null);
                })
                .catch((error) => {
                    console.error("Error updating chef:", error);
                });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this chef?")) {
            const chefRef = ref(db, `users/${id}`);
            remove(chefRef)
                .catch((error) => {
                    console.error("Error deleting chef:", error);
                });
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className='text-3xl font-bold text-gray-800'>Manage Chefs</h2>
                <button
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-orange-700 shadow-sm hover:shadow-md transition-all"
                    onClick={() => setAddchef(!addchef)}
                >
                    {addchef ? <FaTimes /> : <FaPlus />}
                    {addchef ? 'Cancel' : 'Add New Chef'}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search chef by name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-48">
                    <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Add Chef Form */}
            {addchef && (
                <div className="bg-orange-50 p-6 rounded-2xl mb-8 border border-orange-100">
                    <h3 className="text-xl font-bold text-orange-800 mb-4">Add New Chef</h3>
                    <form onSubmit={handleSubmitAdd(onAddSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    {...registerAdd("name", { required: "Name is required" })}
                                    className={`px-4 py-2 rounded-lg border ${errorsAdd.name ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsAdd.name && <span className="text-xs text-red-500">{errorsAdd.name.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    {...registerAdd("email", { required: "Email is required" })}
                                    className={`px-4 py-2 rounded-lg border ${errorsAdd.email ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsAdd.email && <span className="text-xs text-red-500">{errorsAdd.email.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    {...registerAdd("phonenumber", { required: "Phone is required" })}
                                    className={`px-4 py-2 rounded-lg border ${errorsAdd.phonenumber ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsAdd.phonenumber && <span className="text-xs text-red-500">{errorsAdd.phonenumber.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    {...registerAdd("address", { required: "Address is required" })}
                                    className={`px-4 py-2 rounded-lg border ${errorsAdd.address ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsAdd.address && <span className="text-xs text-red-500">{errorsAdd.address.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <select
                                    {...registerAdd("status")}
                                    className="px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                                Save Chef
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Chefs List */}
            <div className="space-y-4">
                {filteredChefs.length > 0 ? (
                    filteredChefs.map(chef => (
                        <div key={chef.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-all">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 ring-2 ring-orange-100">
                                    <PiChefHatDuotone size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{chef.name}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <span className="font-medium text-gray-700">Email:</span> {chef.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="font-medium text-gray-700">Phone:</span> {chef.phonenumber}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="font-medium text-gray-700">Address:</span> {chef.address}
                                        </span>
                                    </div>
                                    <div className={`mt-2 inline-flex px-2 py-0.5 rounded text-xs font-semibold ${chef.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {chef.status}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit" onClick={() => {
                                    setCurrentChef(chef);
                                    setEditchef(true);
                                }
                                }>
                                    <FaEdit size={18} />
                                </button>
                                <button
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                    onClick={() => handleDelete(chef.id)}
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">No chefs found matching your criteria.</p>
                    </div>
                )}
            </div>

            {editchef && currentChef && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setEditchef(false)}
                >
                    {/* Modal Box */}
                    <div
                        className="w-[95%] max-w-5xl bg-orange-50 p-6 rounded-2xl border border-orange-100 animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-orange-800 mb-6">
                            Edit Chef
                        </h3>

                        <form
                            onSubmit={handleSubmitEdit(onEditSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    {...registerEdit("name", { required: "Name is required" })}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${errorsEdit.name ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsEdit.name && <span className="text-xs text-red-500">{errorsEdit.name.message}</span>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...registerEdit("email", { required: "Email is required" })}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${errorsEdit.email ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsEdit.email && <span className="text-xs text-red-500">{errorsEdit.email.message}</span>}
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    {...registerEdit("phonenumber", { required: "Phone number is required" })}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${errorsEdit.phonenumber ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsEdit.phonenumber && <span className="text-xs text-red-500">{errorsEdit.phonenumber.message}</span>}
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    {...registerEdit("address", { required: "Address is required" })}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${errorsEdit.address ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                                />
                                {errorsEdit.address && <span className="text-xs text-red-500">{errorsEdit.address.message}</span>}
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    {...registerEdit("status")}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="col-span-full flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-300"
                                    onClick={() => setEditchef(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chef;