import React, { useEffect, useState } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaTag,
    FaPercentage,
    FaCalendarAlt
} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { database } from '../../../firebase';
import {
    ref,
    push,
    update,
    remove,
    onValue,
    off
} from 'firebase/database';

const Offers = () => {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [offers, setOffers] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const db = database;
    /* ================= FETCH OFFERS ================= */
    useEffect(() => {
        const offersRef = ref(db, 'offers');

        onValue(offersRef, (snapshot) => {
            const data = snapshot.val() || {};
            const list = Object.entries(data).map(([id, val]) => ({
                id,
                ...val,
            }));
            setOffers(list);
        });

        return () => off(offersRef);
    }, []);

    /* ================= Submit ================= */
    const onSubmit = async (data) => {
        if (editingId === null) {
            await addOffer(data);
        } else {
            await updateOffer(editingId, data);
        }
        closeModal();
    };


    /* ================= ADD / UPDATE ================= */
    const addOffer = async (data) => {
        await push(ref(db, 'offers'), {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    };

    const updateOffer = async (id, data) => {
        await update(ref(db, `offers/${id}`), {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    };


    /* ================= DELETE ================= */
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            remove(ref(db, `offers/${id}`));
        }
    };

    /* ================= MODAL ================= */
    const openAddModal = () => {
        setEditingId(null);
        reset({
            code: '',
            description: '',
            discount: '',
            expiryDate: '',
            status: 'Active'
        });
        setShowModal(true);
    };

    const openEditModal = (offer) => {
        setEditingId(offer.id);
        reset(offer);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        reset();
    };

    /* ================= FILTER ================= */
    const filteredOffers = offers.filter((offer) => {
        const matchesSearch =
            (offer.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (offer.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'All' || offer.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Manage Offers</h2>
                    <p className="text-gray-500">Create and manage promo codes</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-orange-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                >
                    <FaPlus /> Add Offer
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-white p-4 rounded-xl">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        className="pl-10 w-full py-2 rounded-xl bg-gray-50"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="px-4 py-2 rounded-xl bg-gray-50"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Expired</option>
                </select>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => (
                    <div
                        key={offer.id}
                        className="bg-white p-6 rounded-xl shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <FaTag className="text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold">{offer.code}</h3>
                                <p className="text-sm text-gray-500">
                                    <FaPercentage className="inline" /> {offer.discount}%
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">
                            {offer.description}
                        </p>

                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <FaCalendarAlt />{' '}
                            {new Date(offer.expiryDate).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => openEditModal(offer)}
                                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(offer.id)}
                                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-6 rounded-xl w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-4">
                            {editingId ? 'Edit Offer' : 'Add Offer'}
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input
                                placeholder="Coupon Code"
                                {...register('code', { required: true })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />

                            <input
                                type="number"
                                placeholder="Discount %"
                                {...register('discount', { required: true })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />

                            <input
                                type="date"
                                {...register('expiryDate', { required: true })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />

                            <textarea
                                placeholder="Description"
                                {...register('description', { required: true })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />

                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 border rounded-xl"
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Expired</option>
                            </select>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-600 text-white rounded-xl"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;
