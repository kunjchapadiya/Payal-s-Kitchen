import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaTag } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const ManagePlans = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    // Dummy Subscription Plans matching Subscription model
    const [plans, setPlans] = useState([
        {
            id: 'SUB-001',
            name: 'Weekly Tiffin Basic',
            price: 1200,
            duration: 'monthly', // Model says enum: monthly, quarterly, yearly.
            description: 'Simple home cooked meal for 5 days a week.',
            features: ['5 Roti', '1 Sabji', 'Dal Rice', 'Salad']
        },
        {
            id: 'SUB-002',
            name: 'Premium Monthly Feast',
            price: 5000,
            duration: 'monthly',
            description: 'Full course meal with sweets for all 30 days.',
            features: ['7 Roti', '2 Sabji', 'Dal Rice', 'Sweet', 'Farsan', 'Buttermilk']
        },
        {
            id: 'SUB-003',
            name: 'Quarterly Saver',
            price: 14000,
            duration: 'quarterly',
            description: 'Long term plan with great savings.',
            features: ['Standard Thali', 'Weekend Specials']
        }
    ]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (editingPlan) {
            reset({
                ...editingPlan,
                features: editingPlan.features.join(', ')
            });
        }
    }, [editingPlan, reset]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            setPlans(plans.filter(p => p.id !== id));
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingPlan(null);
        reset({
            name: '',
            price: '',
            duration: 'monthly',
            description: '',
            features: ''
        });
        setShowForm(!showForm);
    };

    const onSubmit = (data) => {
        const featuresArray = data.features.split(',').map(f => f.trim()).filter(f => f !== '');
        const planObj = {
            ...data,
            price: Number(data.price),
            features: featuresArray
        };

        if (editingPlan) {
            setPlans(plans.map(p => p.id === editingPlan.id ? { ...planObj, id: editingPlan.id } : p));
        } else {
            const newId = `SUB-${Date.now()}`;
            setPlans([...plans, { ...planObj, id: newId }]);
        }

        setShowForm(false);
        setEditingPlan(null);
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Manage Subscriptions</h2>
                    <p className="text-gray-500 mt-1">Create and update meal plans</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-orange-700 shadow-sm hover:shadow-md transition-all"
                >
                    {showForm && !editingPlan ? <FaTimes /> : <FaPlus />}
                    {showForm && !editingPlan ? 'Cancel' : 'Add New Plan'}
                </button>
            </div>

            {/* Add/Edit Plan Form */}
            {showForm && (
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 animate-slide-in mb-8">
                    <h3 className="text-xl font-bold text-orange-800 mb-6">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="form-group">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Plan Name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Plan Name is required" })}
                                className={`w-full px-4 py-2.5 rounded-xl bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹)</label>
                            <input
                                type="number"
                                {...register("price", { required: "Price is required", min: 0 })}
                                className={`w-full px-4 py-2.5 rounded-xl bg-white border ${errors.price ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                            />
                            {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Duration</label>
                            <select
                                {...register("duration", { required: "Duration is required" })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                            <input
                                type="text"
                                {...register("description", { required: "Description is required" })}
                                className={`w-full px-4 py-2.5 rounded-xl bg-white border ${errors.description ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                            />
                            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                        </div>
                        <div className="form-group md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Features (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. 5 Roti, Free Delivery, Sweet Dish"
                                {...register("features", { required: "Features are required" })}
                                className={`w-full px-4 py-2.5 rounded-xl bg-white border ${errors.features ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none`}
                            />
                            {errors.features && <span className="text-xs text-red-500">{errors.features.message}</span>}
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setEditingPlan(null); }}
                                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-orange-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-orange-700 shadow-sm transition-all">
                                {editingPlan ? 'Save Changes' : 'Save Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {plan.duration}
                                </span>
                                <h3 className="text-2xl font-bold text-gray-800">₹{plan.price}</h3>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

                            <div className="space-y-2 border-t border-gray-100 pt-4">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaTag className="text-orange-400 text-xs" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(plan)}
                                className="flex-1 py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="flex-1 py-2 text-center text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagePlans;
