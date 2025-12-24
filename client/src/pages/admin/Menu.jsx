import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImage } from 'react-icons/fa';
import { database } from '../../../firebase';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dfmy8paj2'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'payal-kitchen-menu'; // Replace with your upload preset

const Menu = () => {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [editItem, setEditItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm();

    const db = database;

    // State for menu items - will be loaded from Firebase
    const [menuItems, setMenuItems] = useState([]);

    // Fetch menu items from Firebase
    useEffect(() => {
        const menuRef = ref(db, 'menuItems/');
        onValue(menuRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formatted = Object.entries(data).map(([id, value]) => ({
                id,
                ...value,
            }));
            setMenuItems(formatted);
        });
    }, [db]);

    useEffect(() => {
        if (editItem) {
            resetEdit(editItem);
        }
    }, [editItem, resetEdit]);

    // Upload image to Cloudinary
    const uploadImageToCloudinary = async (file) => {
        if (!file) return null;

        try {
            setUploading(true);
            console.log('Starting upload to Cloudinary...', file.name);

            // Create FormData to send to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'payal-kitchen/menu'); // Optional: organize in folders

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${`dfmy8paj2`}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            console.log('Cloudinary Response:', data);

            if (!response.ok) {
                // Show detailed error from Cloudinary
                const errorMessage = data.error?.message || 'Upload failed';
                console.error('Cloudinary Error:', data);
                toast.error(`Failed to upload image: ${errorMessage}`);
                throw new Error(errorMessage);
            }

            console.log('Upload successful!');
            return data.secure_url; // Returns the image URL
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(`Failed to upload image. ${error.message || 'Please try again.'}`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleAddSubmit = async (data) => {
        try {
            setUploading(true);
            console.log("Adding Item:", data);

            // Get the selected image file
            const imageFile = selectedImage;
            let imageUrl = '';

            // Upload image if selected
            if (imageFile) {
                imageUrl = await uploadImageToCloudinary(imageFile);
                if (!imageUrl) {
                    setUploading(false);
                    return; // Stop if image upload failed
                }
            }

            // Create new menu item
            const newItem = {
                name: data.name,
                category: data.category,
                price: Number(data.price),
                description: data.description,
                image: imageUrl ? [imageUrl] : [], // Store as array
                createdAt: new Date().toUTCString()
            };

            // Save to Firebase
            const menuRef = ref(db, 'menuItems/');
            const newMenuRef = push(menuRef);
            await set(newMenuRef, newItem);

            // Reset form and close
            setShowForm(false);
            resetAdd();
            setSelectedImage(null);
            toast.success('Menu item added successfully!');
        } catch (error) {
            console.error('Error adding menu item:', error);
            toast.error('Failed to add menu item. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleEditSubmit = async (data) => {
        try {
            console.log("Editing Item:", data);

            const updateRef = ref(db, 'menuItems/' + editItem.id);
            const updatedData = {
                name: data.name,
                category: data.category,
                price: Number(data.price),
                description: data.description,
                image: editItem.image || [] // Keep existing image
            };

            await update(updateRef, updatedData);
            setEditItem(null);
            toast.success('Menu item updated successfully!');
        } catch (error) {
            console.error('Error updating menu item:', error);
            toast.error('Failed to update menu item. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await remove(ref(db, 'menuItems/' + id));
                toast.success('Menu item deleted successfully!');
            } catch (error) {
                console.error('Error deleting menu item:', error);
                toast.error('Failed to delete menu item. Please try again.');
            }
        }
    };

    const filteredMenuItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setSelectedImage(null);
                            resetAdd();
                        }
                    }}
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-orange-700 transition-all font-medium shadow-sm hover:shadow-md"
                >
                    {showForm ? 'Cancel' : <><FaPlus className="text-sm" /> Add New Item</>}
                </button>
            </div>

            {/* Add/Edit Form Section */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Food Item</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmitAdd(handleAddSubmit)}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Food Name</label>
                            <input
                                type="text"
                                {...registerAdd("name", { required: "Name is required" })}
                                placeholder="e.g. Punjabi Thali"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${errorsAdd.name ? 'border-red-500' : ''}`}
                            />
                            {errorsAdd.name && <p className="text-red-500 text-xs">{errorsAdd.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                            <input
                                type="number"
                                {...registerAdd("price", { required: "Price is required", min: 1 })}
                                placeholder="0.00"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${errorsAdd.price ? 'border-red-500' : ''}`}
                            />
                            {errorsAdd.price && <p className="text-red-500 text-xs">{errorsAdd.price.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                {...registerAdd("category", { required: "Category is required" })}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${errorsAdd.category ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select Category</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                            {errorsAdd.category && <p className="text-red-500 text-xs">{errorsAdd.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Food Image</label>

                            <label
                                htmlFor="foodImage"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-dashed transition-colors cursor-pointer text-center flex items-center justify-center gap-2 ${selectedImage ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-orange-400'
                                    }`}
                            >
                                <FaImage /> {selectedImage ? `Selected: ${selectedImage.name}` : 'Upload Image'}
                            </label>

                            <input
                                id="foodImage"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setSelectedImage(file);
                                    }
                                }}
                            />
                        </div>


                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                {...registerAdd("description", { required: "Description is required" })}
                                rows="3"
                                placeholder="Enter food description..."
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none ${errorsAdd.description ? 'border-red-500' : ''}`}
                            ></textarea>
                            {errorsAdd.description && <p className="text-red-500 text-xs">{errorsAdd.description.message}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedImage(null);
                                    resetAdd();
                                }}
                                className="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`px-6 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-sm hover:shadow-md transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {uploading ? 'Uploading...' : 'Save Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Menu List Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4 flex-col md:flex-row">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Food Item</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMenuItems.length > 0 ? (
                                filteredMenuItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                                    {item.image?.length > 0 ? <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover" /> : <FaImage />}
                                                </div>
                                                <span className="font-semibold text-gray-800">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-800">
                                            ₹{item.price}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                                            {item.description}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditItem(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No menu items found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Edit Menu Item Modal */}
            {editItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setEditItem(null)}
                >
                    <div
                        className="w-[95%] max-w-2xl bg-white p-6 rounded-2xl border border-gray-100 shadow-xl animate-scale-in max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Edit Menu Item</h3>
                        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Food Name</label>
                                <input
                                    type="text"
                                    {...registerEdit("name", { required: "Name is required" })}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${errorsEdit.name ? 'border-red-500' : ''}`}
                                />
                                {errorsEdit.name && <p className="text-red-500 text-xs">{errorsEdit.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                                <input
                                    type="number"
                                    {...registerEdit("price", { required: "Price is required", min: 1 })}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${errorsEdit.price ? 'border-red-500' : ''}`}
                                />
                                {errorsEdit.price && <p className="text-red-500 text-xs">{errorsEdit.price.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select
                                    {...registerEdit("category", { required: "Category is required" })}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all ${errorsEdit.category ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snacks">Snacks</option>
                                </select>
                                {errorsEdit.category && <p className="text-red-500 text-xs">{errorsEdit.category.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Food Image</label>
                                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors cursor-pointer text-center relative group">
                                    <span className="text-gray-500 text-sm flex items-center justify-center gap-2">
                                        <FaImage /> Update Image
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" multiple />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    {...registerEdit("description", { required: "Description is required" })}
                                    rows="3"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none ${errorsEdit.description ? 'border-red-500' : ''}`}
                                ></textarea>
                                {errorsEdit.description && <p className="text-red-500 text-xs">{errorsEdit.description.message}</p>}
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setEditItem(null)}
                                    className="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-sm hover:shadow-md transition-all"
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

export default Menu;