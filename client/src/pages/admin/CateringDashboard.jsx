import { useEffect, useState } from 'react';
import { FaSearch, FaCalendarAlt, FaUsers, FaGlassCheers, FaClock, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { database } from '../../../firebase';
import { ref, onValue, update } from 'firebase/database';
import { toast } from 'react-toastify';

const CateringDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [viewOrder, setViewOrder] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const cateringRef = ref(database, 'catering');

        const showBookings = onValue(cateringRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setBookings(Object.entries(data).map(([id, booking]) => ({ id, ...booking })));
            } else {
                setBookings([]);
            }
        });

        // cleanup (important!)
        return () => showBookings();
    }, []);

    const handleApproveBooking = (bookingId) => {
        const cateringRef = ref(database, `catering/${bookingId}`);
        update(cateringRef, { status: 'Confirmed' });
        toast.success('Booking approved successfully!');
    };

    const handleRejectBooking = (bookingId) => {
        const cateringRef = ref(database, `catering/${bookingId}`);
        update(cateringRef, { status: 'Rejected' });
        toast.error('Booking rejected successfully!');
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const sortedBookings = [...bookings].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    const filteredBookings = sortedBookings.filter(booking => {
        const matchesSearch =
            booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone.includes(searchTerm) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
        const matchesType = filterType === 'All' || booking.eventType.toLowerCase() === filterType.toLowerCase();

        return matchesSearch && matchesStatus && matchesType;
    });

    // Stats
    const totalRequests = bookings.length;
    const pendingRequests = bookings.filter(b => b.status === 'Pending').length;
    const upcomingEvents = bookings.filter(b => b.status === 'Confirmed' && new Date(b.eventDate) >= new Date()).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Catering Management</h2>
                    <p className="text-gray-500 mt-1">Review and manage event booking requests</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Requests</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalRequests}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
                        <FaGlassCheers />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Pending Approvals</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{pendingRequests}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-xl">
                        <FaClock />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Upcoming Confirmed</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{upcomingEvents}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                        <FaCalendarAlt />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Name, Phone or ID..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[150px]">
                    <select
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all cursor-pointer"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Events</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday</option>
                        <option value="corporate">Corporate</option>
                        <option value="engagement">Engagement</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="relative min-w-[150px]">
                    <select
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Catering Requests Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Booking ID</th>
                                <th className="p-4 font-semibold">Client Details</th>
                                <th className="p-4 font-semibold">Event Type</th>
                                <th className="p-4 font-semibold">Guests</th>
                                <th className="p-4 font-semibold">Event Date</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-orange-600 text-sm">
                                            {booking.id}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{booking.fullName}</div>
                                            <div className="text-xs text-gray-500">{booking.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                {booking.eventType === 'wedding' && '💍'}
                                                {booking.eventType === 'birthday' && '🎂'}
                                                {booking.eventType === 'corporate' && '💼'}
                                                <span className="capitalize">{booking.eventType}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">
                                            <div className="flex items-center gap-1">
                                                <FaUsers className="text-gray-400 text-xs" />
                                                {booking.guestCount}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(booking.eventDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApproveBooking(booking.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => handleRejectBooking(booking.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <FaTimes />
                                                </button>
                                                <button
                                                    onClick={() => setViewOrder(booking)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details / Requirements"
                                                >
                                                    <FaEye />
                                                </button>
                                                {booking.status === 'Pending' && (
                                                    <>
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                                            <FaCheck />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        No catering requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static) */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div>Showing {filteredBookings.length} of {bookings.length} requests</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* View Order Modal */}
            {viewOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setViewOrder(null)}
                >
                    <div
                        className="w-[95%] max-w-2xl bg-white p-6 rounded-2xl border border-gray-100 shadow-xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                                <p className="text-gray-500 text-sm mt-1">ID: <span className="font-mono text-orange-600">{viewOrder.id}</span></p>
                            </div>
                            <button
                                onClick={() => setViewOrder(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Client Info */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaUsers className="text-orange-500" /> Client Information
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><span className="font-medium text-gray-800">Name:</span> {viewOrder.fullName}</p>
                                    <p><span className="font-medium text-gray-800">Phone:</span> {viewOrder.phone}</p>
                                </div>
                            </div>

                            {/* Event Info */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaCalendarAlt className="text-orange-500" /> Event Details
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><span className="font-medium text-gray-800">Type:</span> <span className="capitalize">{viewOrder.eventType}</span></p>
                                    <p><span className="font-medium text-gray-800">Date:</span> {new Date(viewOrder.eventDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium text-gray-800">Guests:</span> {viewOrder.guestCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status & Requirements */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-700">Current Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(viewOrder.status)}`}>
                                    {viewOrder.status}
                                </span>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <h4 className="font-semibold text-orange-800 mb-2">Requirements & Notes</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {viewOrder.requirements || "No specific requirements mentioned."}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setViewOrder(null)}
                                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CateringDashboard;
