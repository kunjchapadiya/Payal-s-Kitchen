import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaClock, FaUtensils } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../../firebase';
import { ref, onValue, update } from 'firebase/database';
import { toast } from 'react-toastify';

const ChefOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const ordersRef = ref(database, 'orders');
        const unsubscribe = onValue(ordersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedOrders = Object.entries(data).map(([key, order]) => ({
                    firebaseKey: key,
                    id: order.orderId,
                    customerName: order.userDetails?.name || 'Guest',
                    products: order.items || [],
                    totalAmount: order.totalAmount,
                    status: order.status,
                    orderDate: order.orderDate,
                    instructions: '', // Instructions field if you add it later
                    assignedTo: order.assignedTo || ''
                }));

                // Filter logic:
                // Show 'Placed' orders (available for any chef to pick up)
                // OR orders already assigned to THIS chef
                const RelevantOrders = fetchedOrders.filter(order =>
                    (order.status === 'Placed') ||
                    (order.assignedTo === user?.displayName && order.status !== 'Completed' && order.status !== 'Cancelled')
                ).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

                setOrders(RelevantOrders);
            } else {
                setOrders([]);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const handleAccept = async (order) => {
        if (!user?.displayName) {
            toast.error("You must have a display name to accept orders.");
            return;
        }

        try {
            const orderRef = ref(database, `orders/${order.firebaseKey}`);
            await update(orderRef, {
                status: 'Cooking',
                assignedTo: user.displayName
            });
            toast.success("Order Accepted & Cooking Started!");
        } catch (error) {
            console.error("Error accepting order:", error);
            toast.error("Failed to accept order");
        }
    };

    const handleDecline = async (order) => {
        if (!window.confirm("Are you sure you want to reject this order?")) return;

        try {
            const orderRef = ref(database, `orders/${order.firebaseKey}`);
            await update(orderRef, {
                status: 'Cancelled',
                assignedTo: user?.displayName || 'Chef (Rejected)'
            });
            toast.error("Order Rejected");
        } catch (error) {
            console.error("Error rejecting order:", error);
        }
    };

    const handleReady = async (order) => {
        try {
            const orderRef = ref(database, `orders/${order.firebaseKey}`);
            await update(orderRef, {
                status: 'Completed' // or 'Ready' / 'Delivered' depending on flow. Let's say Completed removes it from active list.
            });
            toast.success("Order Marked as Ready!");
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'placed': return 'bg-yellow-100 text-yellow-700';
            case 'cooking': return 'bg-blue-100 text-blue-700'; // Processing/Cooking
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Kitchen Orders</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaUtensils className="text-orange-500" />
                                    {order.id}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Customer: {order.customerName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="border-t border-b border-gray-100 py-3 my-3">
                            <div className="space-y-2">
                                {order.products.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-700 font-medium">{item.quantity} x {item.title || item.name}</span>
                                    </div>
                                ))}
                            </div>
                            {order.instructions && (
                                <div className="mt-3 bg-red-50 text-red-600 text-sm p-2 rounded-lg">
                                    <strong>Note:</strong> {order.instructions}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                                <FaClock /> {new Date(order.orderDate).toLocaleTimeString()}
                            </div>
                            {order.assignedTo && <div className="text-xs bg-gray-100 px-2 py-1 rounded">Chef: {order.assignedTo}</div>}
                        </div>

                        <div className="flex gap-3">
                            {order.status === 'Placed' && (
                                <>
                                    <button
                                        onClick={() => handleAccept(order)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaCheck /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(order)}
                                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaTimes /> Decline
                                    </button>
                                </>
                            )}
                            {order.status === 'Cooking' && order.assignedTo === user?.displayName && (
                                <button
                                    onClick={() => handleReady(order)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaCheck /> Mark as Ready
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {orders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No Pending orders found.
                </div>
            )}
        </div>
    );
};

export default ChefOrders;
