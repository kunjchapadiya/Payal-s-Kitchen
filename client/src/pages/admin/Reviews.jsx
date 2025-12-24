import React, { useState } from 'react';
import { FaSearch, FaStar, FaTrash, FaQuoteLeft } from 'react-icons/fa';

const Reviews = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('All');

    // Dummy data matching Feedback model
    const [reviews, setReviews] = useState([
        {
            id: 'REV-001',
            orderId: 'ORD-1001',
            customerName: 'Payal Patel',
            rating: 5,
            feedbackText: 'The Gujarati Thali was absolutely delicious! Reminded me of home.',
            feedbackDate: '2024-12-16',
        },
        {
            id: 'REV-002',
            orderId: 'ORD-1002',
            customerName: 'Kunj Somani',
            rating: 4,
            feedbackText: 'Great taste, but delivery was slightly delayed. Roti was soft.',
            feedbackDate: '2024-12-15',
        },
        {
            id: 'REV-003',
            orderId: 'ORD-1004',
            customerName: 'Rahul Sharma',
            rating: 3,
            feedbackText: 'Biryani was okay, but a bit too spicy for my taste.',
            feedbackDate: '2024-12-14',
        },
        {
            id: 'REV-004',
            orderId: 'ORD-1005',
            customerName: 'Priya Singh',
            rating: 5,
            feedbackText: 'Paneer Butter Masala is a must-try! Loved the creaminess.',
            feedbackDate: '2024-12-13',
        },
        {
            id: 'REV-005',
            orderId: 'ORD-1006',
            customerName: 'Amit Kumar',
            rating: 2,
            feedbackText: 'Food was cold when it arrived. Packaging needs improvement.',
            feedbackDate: '2024-12-12',
        },
    ]);

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.feedbackText.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = filterRating === 'All' || review.rating.toString() === filterRating;

        return matchesSearch && matchesRating;
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    // Calculate Average Rating
    const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Reviews & Feedback</h2>
                    <p className="text-gray-500 mt-1">Manage customer feedback and ratings</p>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Average Rating:</span>
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-lg">
                        <FaStar /> {averageRating} / 5.0
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Customer Name or Feedback content..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[150px]">
                    <select
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all cursor-pointer"
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                    >
                        <option value="All">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Reviews Grid/List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                                        {review.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{review.customerName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>Order #{review.orderId}</span>
                                            <span>•</span>
                                            <span>{review.feedbackDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <FaQuoteLeft className="text-gray-300 flex-shrink-0 mt-1" />
                                <p className="text-gray-600 italic flex-1">
                                    {review.feedbackText}
                                </p>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors self-start"
                                    title="Delete Review"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                        No reviews found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
