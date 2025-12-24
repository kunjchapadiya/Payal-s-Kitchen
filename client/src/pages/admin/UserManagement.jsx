import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaSearch, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { database } from "../../../firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";

const UserManagement = () => {
    const [adduser, setAdduser] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [edituser, setEdituser] = useState(null);
    const [users, setUsers] = useState([]);
    const db = database;

    // Form for ADD
    const {
        register: registerAdd,
        handleSubmit: handleSubmitAdd,
        reset: resetAdd,
        formState: { errors: errorsAdd },
    } = useForm();

    // Form for EDIT
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: errorsEdit },
    } = useForm();

    // FETCH USERS FROM FIREBASE (Realtime)
    useEffect(() => {
        const usersRef = ref(db, "users/");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formatted = Object.entries(data).map(([id, value]) => ({
                id,
                ...value,
            }));
            setUsers(formatted);
        });
    }, []);

    // Prefill edit form
    useEffect(() => {
        if (edituser) {
            resetEdit(edituser);
        }
    }, [edituser, resetEdit]);

    // ADD USER -> Firebase
    const onAddSubmit = (data) => {
        const listRef = ref(db, "users/");
        const newRef = push(listRef);
        set(newRef, { ...data, role: "user" });
        resetAdd();
        setAdduser(false);
    };

    // UPDATE USER -> Firebase
    const onEditSubmit = (data) => {
        const updateRef = ref(db, "users/" + edituser.id);
        update(updateRef, data);
        setEdituser(null);
    };

    // DELETE USER -> Firebase
    const handleDelete = (id) => {
        remove(ref(db, "users/" + id));
    };

    // SEARCH
    const filteredUsers = users.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>
                <button
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-orange-700 shadow-sm hover:shadow-md transition-all"
                    onClick={() => setAdduser(!adduser)}
                >
                    {adduser ? <FaTimes /> : <FaPlus />}
                    {adduser ? "Cancel" : "Add New User"}
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search user by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Add User Form */}
            {adduser && (
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 animate-slide-in">
                    <h3 className="text-xl font-bold text-orange-800 mb-6">Add New User</h3>
                    <form
                        onSubmit={handleSubmitAdd(onAddSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input
                                {...registerAdd("name", { required: "Name is required" })}
                                className={`px-4 py-2.5 rounded-xl border ${errorsAdd.name ? "border-red-500" : "border-gray-200"
                                    }`}
                            />
                            {errorsAdd.name && (
                                <span className="text-xs text-red-500">
                                    {errorsAdd.name.message}
                                </span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                {...registerAdd("email", {
                                    required: "Email is required",
                                })}
                                className={`px-4 py-2.5 rounded-xl border ${errorsAdd.email ? "border-red-500" : "border-gray-200"
                                    }`}
                            />
                            {errorsAdd.email && (
                                <span className="text-xs text-red-500">
                                    {errorsAdd.email.message}
                                </span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                {...registerAdd("phonenumber", {
                                    required: "Phone is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "10 digit number",
                                    },
                                })}
                                className={`px-4 py-2.5 rounded-xl border ${errorsAdd.phonenumber ? "border-red-500" : "border-gray-200"
                                    }`}
                            />
                            {errorsAdd.phonenumber && (
                                <span className="text-xs text-red-500">
                                    {errorsAdd.phonenumber.message}
                                </span>
                            )}
                        </div>

                        {/* Address */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                {...registerAdd("address", { required: "Address required" })}
                                className={`px-4 py-2.5 rounded-xl border ${errorsAdd.address ? "border-red-500" : "border-gray-200"
                                    }`}
                            />
                            {errorsAdd.address && (
                                <span className="text-xs text-red-500">
                                    {errorsAdd.address.message}
                                </span>
                            )}
                        </div>

                        <div className="col-span-full flex justify-end gap-3 mt-3">
                            <button
                                type="button"
                                className="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-white"
                                onClick={() => setAdduser(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-600 text-white px-8 py-2.5 rounded-xl hover:bg-orange-700"
                            >
                                Save User
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white p-5 rounded-xl border shadow-sm flex justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <FaUser size={22} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {user.name}
                                    </h2>
                                    <span className="text-sm text-gray-600">{user.email}</span>
                                    <br />
                                    <span className="text-sm text-gray-600">
                                        {user.phonenumber}
                                    </span>
                                    <br />
                                    <span className="text-sm text-gray-600">{user.address}</span>
                                    <br />
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    onClick={() => setEdituser(user)}
                                >
                                    <FaEdit size={18} />
                                </button>
                                <button
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border">
                        <p className="text-gray-500 text-lg">No users found.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {edituser && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center"
                    onClick={() => setEdituser(null)}
                >
                    <div
                        className="bg-white p-6 rounded-xl w-[90%] max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-orange-800 mb-6">
                            Edit User
                        </h3>

                        <form
                            onSubmit={handleSubmitEdit(onEditSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-sm">Name</label>
                                <input
                                    {...registerEdit("name", { required: "Name required" })}
                                    className={`px-4 py-2.5 rounded-xl border ${errorsEdit.name ? "border-red-500" : "border-gray-200"
                                        }`}
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-sm">Email</label>
                                <input
                                    {...registerEdit("email", { required: "Email required" })}
                                    className={`px-4 py-2.5 rounded-xl border ${errorsEdit.email ? "border-red-500" : "border-gray-200"
                                        }`}
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-sm">Phone</label>
                                <input
                                    {...registerEdit("phonenumber", {
                                        required: "Phone required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "10 digits",
                                        },
                                    })}
                                    className={`px-4 py-2.5 rounded-xl border ${errorsEdit.phonenumber
                                        ? "border-red-500"
                                        : "border-gray-200"
                                        }`}
                                />
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-sm">Address</label>
                                <input
                                    {...registerEdit("address", { required: "Address required" })}
                                    className={`px-4 py-2.5 rounded-xl border ${errorsEdit.address
                                        ? "border-red-500"
                                        : "border-gray-200"
                                        }`}
                                />
                            </div>

                            <div className="col-span-full flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    className="px-6 py-2.5 bg-gray-200 rounded-xl"
                                    onClick={() => setEdituser(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-orange-600 text-white rounded-xl"
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

export default UserManagement;
