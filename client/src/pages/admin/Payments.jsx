import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaClock, FaFileInvoiceDollar } from 'react-icons/fa';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterMethod, setFilterMethod] = useState('All');
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const paymentsRef = ref(database, 'payments');
        const unsubscribe = onValue(paymentsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedPayments = Object.values(data).map(payment => ({
                    id: payment.transactionId,
                    userId: payment.userDetails || { name: 'Guest', email: 'N/A' },
                    amount: payment.totalAmount,
                    paymentStatus: payment.status || 'Success',
                    paymentMethod: payment.paymentMode,
                    paymentDate: payment.timestamp || new Date().toISOString(),
                    // Flattening for cleaner access if needed, but keeping structure for now
                    displayDate: `${payment.date} ${payment.time}`
                })).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
                setPayments(fetchedPayments);
            } else {
                setPayments([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'success': return 'bg-green-100 text-green-700';
            case 'failed': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch =
            (payment.id && payment.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (payment.userId.name && payment.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (payment.userId.email && payment.userId.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = filterStatus === 'All' || payment.paymentStatus === filterStatus;
        const matchesMethod = filterMethod === 'All' || payment.paymentMethod === filterMethod;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    // Calculate Summary Stats
    const totalRevenue = payments.reduce((acc, curr) => curr.paymentStatus === 'Success' ? acc + curr.amount : acc, 0);
    const successCount = payments.filter(p => p.paymentStatus === 'Success').length;
    const failedCount = payments.filter(p => p.paymentStatus === 'Failed').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Payment Details</h2>
                    <p className="text-gray-500 mt-1">Track and manage all transactions</p>
                </div>
                <button className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-orange-700 shadow-sm hover:shadow-md transition-all">
                    <FaFileInvoiceDollar /> Export Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                        <FaMoneyBillWave />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Successful Transactions</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{successCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                        <FaCheckCircle />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Failed Transactions</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{failedCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
                        <FaTimesCircle />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Payment ID, Name or Email..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[150px]">
                    <select
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Success">Success</option>
                        <option value="Failed">Failed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <div className="relative min-w-[150px]">
                    <select
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all cursor-pointer"
                        value={filterMethod}
                        onChange={(e) => setFilterMethod(e.target.value)}
                    >
                        <option value="All">All Methods</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Credit Card</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="COD">COD</option>
                    </select>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Transaction ID</th>
                                <th className="p-4 font-semibold">User Details</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Method</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Date & Time</th>
                                <th className="p-4 font-semibold text-center">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-500 text-sm">
                                            {payment.id}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{payment.userId.name}</div>
                                            <div className="text-xs text-gray-500">{payment.userId.email}</div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            ₹{payment.amount}
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">
                                            {payment.paymentMethod}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(payment.paymentStatus)}`}>
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-gray-400" />
                                                {payment.displayDate}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Download Invoice">
                                                <FaFileInvoiceDollar size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        No transaction records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static) */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div>Showing {filteredPayments.length} of {payments.length} transactions</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
