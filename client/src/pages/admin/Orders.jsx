import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch, FaFilter, FaUserPlus, FaTimes } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { database } from '../../../firebase';
import { ref, onValue, update } from 'firebase/database';

const Orders = () => {
    // Dummy user data for assignment dropdown
    const employees = [
        { id: 'EMP001', name: 'Chef Sanjeev' },
        { id: 'EMP002', name: 'Chef Vikas' },
        { id: 'EMP003', name: 'Chef Ranveer' },
    ];

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const ordersRef = ref(database, 'orders');
        const unsubscribe = onValue(ordersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Map entries to preserve firebase key
                const formattedOrders = Object.entries(data).map(([key, order]) => ({
                    firebaseKey: key, // Critical for updates
                    id: order.orderId,
                    user: order.userDetails?.name || 'Guest',
                    products: order.items?.map(item => `${item.title || item.name} (x${item.quantity})`) || [],
                    totalAmount: order.totalAmount,
                    status: order.status,
                    paymentStatus: 'Paid',
                    orderDate: new Date(order.orderDate).toLocaleDateString(),
                    assignedTo: order.assignedTo || '',
                    originalData: order
                })).sort((a, b) => new Date(b.originalData.orderDate) - new Date(a.originalData.orderDate));
                setOrders(formattedOrders);
            } else {
                setOrders([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingOrder, setEditingOrder] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (editingOrder) {
            reset({
                status: editingOrder.status,
                assignedTo: editingOrder.assignedTo || ''
            });
        }
    }, [editingOrder, reset]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Placed': return 'bg-yellow-100 text-yellow-700'; // Match Case
            case 'placed': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleUpdate = async (data) => {
        if (!editingOrder?.firebaseKey) return;

        try {
            const orderRef = ref(database, `orders/${editingOrder.firebaseKey}`);
            await update(orderRef, {
                status: data.status,
                assignedTo: data.assignedTo
            });
            setEditingOrder(null);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.user && order.user.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'All' || order.status.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Manage Orders</h2>
                    <p className="text-gray-500 mt-1">View and update daily orders</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="placed">Placed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Order ID</th>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Products</th>
                                <th className="p-4 font-semibold">Total Amount</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Assigned To</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-orange-600">{order.id}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{order.user}</div>
                                            <div className="text-xs text-gray-500">{order.orderDate}</div>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm max-w-xs truncate">
                                            {order.products.join(', ')}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">₹{order.totalAmount}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {order.assignedTo ? (
                                                <span className="font-medium text-blue-600">{order.assignedTo}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setEditingOrder(order)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Order"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Order">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditingOrder(null)}>
                    <div className="w-[95%] max-w-md bg-white p-6 rounded-2xl border border-gray-100 shadow-xl animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Update Order {editingOrder.id}</h3>
                            <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                                <select
                                    {...register("status")}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                                >
                                    <option value="placed">Placed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Assign To</label>
                                <select
                                    {...register("assignedTo")}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                                >
                                    <option value="">Unassigned</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingOrder(null)}
                                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-sm hover:shadow-md transition-all"
                                >
                                    Update Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;

