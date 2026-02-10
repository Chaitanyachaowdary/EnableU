import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { Users, BookOpen, Activity, Award, TrendingUp } from 'lucide-react';
import { useApi } from '../../../hooks/useApi';
import Toast from '../../common/Toast';
import StatsCard from '../../common/StatsCard';
import SkeletonStatsGrid from '../../common/SkeletonStatsGrid';

const DashboardOverview = () => {
    const { request } = useApi();
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalQuizzes: 0,
        activeUsers: 0,
        totalPoints: 0,
        rawUsers: []
    });

    // Process data for charts
    const processGrowthData = (users) => {
        if (!users || users.length === 0) return [];

        const dates = users.map(u => u.created_at ? u.created_at.split('T')[0] : 'Unknown')
            .filter(d => d !== 'Unknown')
            .sort();

        const countMap = {};
        dates.forEach(date => {
            countMap[date] = (countMap[date] || 0) + 1;
        });

        let cumulative = 0;
        return Object.keys(countMap).map(date => {
            cumulative += countMap[date];
            return { date, users: cumulative };
        });
    };

    const processBadgeData = (users) => {
        if (!users) return [];
        const distribution = { '0': 0, '1': 0, '2': 0, '3+': 0 };

        users.forEach(u => {
            const count = u.gamification?.badges?.length || 0;
            if (count === 0) distribution['0']++;
            else if (count === 1) distribution['1']++;
            else if (count === 2) distribution['2']++;
            else distribution['3+']++;
        });

        return [
            { name: '0 Badges', value: distribution['0'] },
            { name: '1 Badge', value: distribution['1'] },
            { name: '2 Badges', value: distribution['2'] },
            { name: '3+ Badges', value: distribution['3+'] },
        ];
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [users, quizzes] = await Promise.all([
                    request('get', '/admin/users'),
                    request('get', '/quizzes')
                ]);

                setAnalytics({
                    totalUsers: users.length,
                    totalQuizzes: quizzes.length,
                    activeUsers: users.filter(u => (u.gamification?.points || 0) > 0).length,
                    totalPoints: users.reduce((sum, u) => sum + (u.gamification?.points || 0), 0),
                    rawUsers: users // Store for charts
                });
            } catch (error) {
                console.error('Error fetching analytics:', error);
                setToast({ message: 'Failed to load analytics', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [request]);

    const growthData = analytics.totalUsers > 0 ? processGrowthData(analytics.rawUsers || []) : [];
    const badgeData = analytics.totalUsers > 0 ? processBadgeData(analytics.rawUsers || []) : [];

    const stats = [
        { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'indigo' },
        { label: 'Active Learners', value: analytics.activeUsers, icon: Activity, color: 'emerald' },
        { label: 'Total Modules', value: analytics.totalQuizzes, icon: BookOpen, color: 'purple' },
        { label: 'Total Points', value: analytics.totalPoints, icon: Award, color: 'amber' }
    ];

    if (loading) {
        return <SkeletonStatsGrid count={4} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatsCard
                        key={idx}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        colorClass={stat.color}
                        tiltStrength={3}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Growth Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px] flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Growth Trends</h3>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#4F46E5"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Badge Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px] flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <Award size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Badge Distribution</h3>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={badgeData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {badgeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#9CA3AF', '#FCD34D', '#F59E0B', '#D97706'][index] || '#4F46E5'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
