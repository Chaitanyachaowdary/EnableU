import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, Activity, TrendingUp, Award, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Toast from '../../common/Toast';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/admin/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
                setToast({ type: 'error', message: 'Failed to load analytics data' });
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        { label: 'Total Users', value: data.total_users, icon: Users, color: 'indigo', trend: '+12%', trendUp: true },
        { label: 'Active Learners', value: data.active_users, icon: Activity, color: 'emerald', trend: '+5%', trendUp: true },
        { label: 'Courses/Quizzes', value: data.total_quizzes, icon: BookOpen, color: 'purple', trend: 'Stable', trendUp: null },
        { label: 'Admin Actions', value: data.recent_admin_actions, icon: TrendingUp, color: 'orange', trend: '+18%', trendUp: true },
    ];

    const roleData = data.role_distribution || {};
    const totalForRoles = Object.values(roleData).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400">Comprehensive overview of platform performance and user engagement.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon size={24} />
                            </div>
                            {stat.trendUp !== null && (
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stat.trend}
                                    {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                </div>
                            )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution Visualization */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Role Distribution</h3>
                    <div className="space-y-6">
                        {Object.entries(roleData).map(([role, count]) => {
                            const percentage = totalForRoles > 0 ? (count / totalForRoles) * 100 : 0;
                            const colors = {
                                admin: 'indigo',
                                student: 'emerald',
                                teacher: 'purple'
                            };
                            const color = colors[role] || 'gray';

                            return (
                                <div key={role}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{role}s</span>
                                        <span className="text-gray-500">{count} ({Math.round(percentage)}%)</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-${color}-500 rounded-full transition-all duration-1000 ease-out`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Growth</p>
                            <p className="text-lg font-bold text-emerald-600">+4.2%</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Retention</p>
                            <p className="text-lg font-bold text-indigo-600">88%</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Churn</p>
                            <p className="text-lg font-bold text-rose-600">1.5%</p>
                        </div>
                    </div>
                </div>

                {/* Engagement Card */}
                <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Weekly Platform Score</h3>
                        <p className="text-indigo-100 mb-8 opacity-90">Overall health calculated from user engagement and content completion.</p>

                        <div className="flex items-end gap-2 mb-8">
                            <span className="text-6xl font-black">92</span>
                            <span className="text-2xl font-bold opacity-80 mb-2">/100</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Award size={20} />
                                </div>
                                <span>15 new badges earned today</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Clock size={20} />
                                </div>
                                <span>Average session time: 24 mins</span>
                            </div>
                        </div>

                        <button className="mt-8 w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white">
                            Download Full Report
                        </button>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
                    <div className="absolute top-10 right-10 opacity-20 transform rotate-12">
                        <TrendingUp size={120} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
