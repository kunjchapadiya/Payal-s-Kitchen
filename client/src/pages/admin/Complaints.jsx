import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEnvelopeOpenText, FaCheck, FaReply, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import { database } from '../../../firebase';
import { ref, onValue, update } from 'firebase/database';
import { toast } from 'react-toastify';

const Complaints = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [complaints, setComplaints] = useState([]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-yellow-100 text-yellow-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const db = database;

    useEffect(() => {
        const complaintsRef = ref(db, 'contacts');
        onValue(complaintsRef, (snapshot) => {
            const complaintsData = snapshot.val();
            if (complaintsData) {
                const complaintsArray = Object.entries(complaintsData).map(([id, data]) => ({
                    id,
                    ...data,
                }));
                setComplaints(complaintsArray);
            }
        });
    }, []);

    const handleResolve = (id) => {
        const complaintRef = ref(db, `contacts/${id}`);
        update(complaintRef, { status: 'resolved' })
            .then(() => toast.success("Marked as resolved"))
            .catch((err) => toast.error("Failed to update"));
    };

    const handleClose = (id) => {
        const complaintRef = ref(db, `contacts/${id}`);
        update(complaintRef, { status: 'closed' })
            .then(() => toast.success("Ticket closed"))
            .catch((err) => toast.error("Failed to update"));
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch =
            (complaint.name && complaint.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (complaint.message && complaint.message.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = filterStatus === 'All' || complaint.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (id, newStatus) => {
        setComplaints(complaints.map(q => q.id === id ? { ...q, status: newStatus } : q));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Complaint Management</h2>
                    <p className="text-gray-500 mt-1">Handle customer complaints & issues</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Customer or Complaint text..."
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
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Complaints List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Complaint</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((complaint) => (
                                    <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-500 whitespace-nowrap">
                                            {complaint.email}
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">
                                            {complaint.name}
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-sm truncate" title={complaint.message}>
                                            {complaint.message}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Reply">
                                                    <FaReply />
                                                </button>
                                                {complaint.status === 'open' && (
                                                    <button
                                                        onClick={() => handleResolve(complaint.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Mark Resolved"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
                                                {complaint.status !== 'closed' && (
                                                    <button
                                                        onClick={() => handleClose(complaint.id)}
                                                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                                        title="Close Ticket"
                                                    >
                                                        <FaTimesCircle />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No complaints found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Complaints;
