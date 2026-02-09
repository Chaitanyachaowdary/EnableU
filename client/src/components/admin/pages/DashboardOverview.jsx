import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, TrendingUp, Award, Zap } from 'lucide-react';
import Toast from '../../common/Toast';

const DashboardOverview = () => {
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalQuizzes: 0,
        activeUsers: 0,
        totalPoints: 0
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [usersRes, quizzesRes] = await Promise.all([
                    axios.get('/api/admin/users', config),
                    axios.get('/api/quizzes', config)
                ]);

                setAnalytics({
                    totalUsers: usersRes.data.length,
                    totalQuizzes: quizzesRes.data.length,
                    activeUsers: usersRes.data.filter(u => (u.gamification?.points || 0) > 0).length,
                    totalPoints: usersRes.data.reduce((sum, u) => sum + (u.gamification?.points || 0), 0)
                });
            } catch (error) {
                console.error('Error fetching analytics:', error);
                setToast({ message: 'Failed to load analytics', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const stats = [
        { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Courses/Quizzes', value: analytics.totalQuizzes, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Active Learners', value: analytics.activeUsers, icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Total Points Awarded', value: analytics.totalPoints, icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time platform statistics and performance.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for future charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[300px] flex flex-col items-center justify-center text-center">
                    <TrendingUp size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Trends</h3>
                    <p className="text-gray-500 max-w-xs text-sm">Data visualization for user growth and activity will appear here.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[300px] flex flex-col items-center justify-center text-center">
                    <Award size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Badge Distribution</h3>
                    <p className="text-gray-500 max-w-xs text-sm">Visual breakdown of achievements earned by users.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
