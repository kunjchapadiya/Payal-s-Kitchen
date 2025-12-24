import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaRupeeSign, FaUtensils } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>
            {icon}
        </div>
    </div>
);

const DashboardHome = () => {
    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        revenue: 0,
        chefs: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [newUsers, setNewUsers] = useState([]);

    useEffect(() => {
        // Fetch Orders
        const ordersRef = ref(database, 'orders');
        const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const ordersArray = Object.values(data);

                // Stats
                const totalOrders = ordersArray.length;
                const totalRevenue = ordersArray
                    .filter(o => o.status !== 'Cancelled' && o.status !== 'Failed')
                    .reduce((acc, curr) => acc + (parseFloat(curr.totalAmount) || 0), 0);

                // Recent Orders
                const sortedOrders = [...ordersArray].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setRecentOrders(sortedOrders.slice(0, 5));

                // Revenue Data (Monthly)
                const monthlyRevenue = {};
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                ordersArray.forEach(order => {
                    const date = new Date(order.orderDate);
                    const month = months[date.getMonth()];
                    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (parseFloat(order.totalAmount) || 0);
                });
                const formattedRevenueData = Object.entries(monthlyRevenue).map(([name, value]) => ({ name, value }));
                setRevenueData(formattedRevenueData.length > 0 ? formattedRevenueData : [{ name: 'No Data', value: 0 }]);

                // Weekly Orders (Last 7 days)
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const weeklyOrders = {};
                ordersArray.forEach(order => {
                    const date = new Date(order.orderDate);
                    const day = days[date.getDay()];
                    weeklyOrders[day] = (weeklyOrders[day] || 0) + 1;
                });
                const formattedOrderData = days.map(day => ({ name: day, orders: weeklyOrders[day] || 0 }));
                setOrderData(formattedOrderData);

                // Category Data
                const catCount = {};
                ordersArray.forEach(order => {
                    if (order.items && Array.isArray(order.items)) {
                        order.items.forEach(item => {
                            const cat = item.category || 'Other';
                            catCount[cat] = (catCount[cat] || 0) + 1;
                        });
                    }
                });
                const formattedCategoryData = Object.entries(catCount).map(([name, value]) => ({ name, value }));
                setCategoryData(formattedCategoryData.length > 0 ? formattedCategoryData : [{ name: 'Other', value: 1 }]);

                setStats(prev => ({ ...prev, orders: totalOrders, revenue: totalRevenue }));
            }
        });

        // Fetch Users
        const usersRef = ref(database, 'users');
        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const usersArray = Object.values(data);

                const totalUsers = usersArray.length;
                const chefs = usersArray.filter(u => u.role === 'chef' || u.role === 'Chef').length;

                // New Users (Assuming added order based on key or date if available, using end of array as proxy for now)
                const recentUsers = usersArray.slice(-5).reverse();
                setNewUsers(recentUsers);

                setStats(prev => ({ ...prev, users: totalUsers, chefs: chefs }));
            }
        });

        return () => {
            unsubscribeOrders();
            unsubscribeUsers();
        };
    }, []);

    const COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#6366F1'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.users} icon={<FaUsers />} color="bg-blue-50 text-blue-600" />
                <StatCard title="Total Orders" value={stats.orders} icon={<FaShoppingCart />} color="bg-orange-50 text-orange-600" />
                <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<FaRupeeSign />} color="bg-green-50 text-green-600" />
                <StatCard title="Active Chefs" value={stats.chefs} icon={<FaUtensils />} color="bg-purple-50 text-purple-600" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} prefix="₹" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Orders</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orderData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Distribution - Takes up 1 column */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Orders by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders - Takes up 2 columns */}
                <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-6 bg-white">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.map((order, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">#{i + 1}</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Order #{order.orderId || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status || 'Pending'}
                                </span>
                            </div>
                        ))}
                        <button className="w-full py-2 text-center text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition-colors mt-2">View All Orders</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="border border-gray-100 rounded-2xl p-6 bg-white">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">New Users</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {newUsers.map((user, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500">
                                    <FaUsers />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">{user.name || 'User'}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email || 'No Email'}</p>
                                </div>
                                <button className="ml-auto text-orange-600 text-sm font-medium hover:underline">View</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
