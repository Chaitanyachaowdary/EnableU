import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Activity, TrendingUp, Award, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Toast from '../../common/Toast';
import StatsCard from '../../common/StatsCard';
import SkeletonStatsGrid from '../../common/SkeletonStatsGrid';
import { useApi } from '../../../hooks/useApi';

const Analytics = () => {
    const { request, loading, error } = useApi();
    const [data, setData] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await request('get', '/admin/analytics');
                setData(response);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
                setToast({ type: 'error', message: 'Failed to load analytics data' });
            }
        };

        fetchAnalytics();
    }, [request]);

    const handleDownloadReport = async () => {
        try {
            // Using direct fetch/axios for blob download as useApi wrapper might assume JSON
            // But to keep it clean, let's try to use the raw token approach for this specific non-JSON action
            // or just use the same pattern as before but cleaner.
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/analytics/export', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setToast({ type: 'success', message: 'Report downloaded successfully' });
        } catch (error) {
            console.error('Download failed', error);
            setToast({ type: 'error', message: 'Failed to download report' });
        }
    };

    if (loading) {
        return <SkeletonStatsGrid count={4} />;
    }

    if (!data) return null;

    // Calculate dynamic trends if possible, otherwise use reasonable logic
    // For Growth, we can compare last 2 entries in growth_trends if available
    let growthTrend = '+0%';
    let isGrowthPositive = true;

    if (data.growth_trends && data.growth_trends.length >= 2) {
        const last = data.growth_trends[data.growth_trends.length - 1].users;
        const prev = data.growth_trends[data.growth_trends.length - 2].users;
        if (prev > 0) {
            const pct = ((last - prev) / prev) * 100;
            growthTrend = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
            isGrowthPositive = pct >= 0;
        }
    }

    // Role Distribution Logic
    const roleData = data.role_distribution || {};
    const totalForRoles = Object.values(roleData).reduce((a, b) => a + b, 0);

    // Platform Score: Simple heuristic (Active / Total) * 100
    const platformScore = data.total_users > 0
        ? Math.round((data.active_users / data.total_users) * 100)
        : 0;

    const stats = [
        { label: 'Total Users', value: data.total_users, icon: Users, color: 'indigo', trend: growthTrend, trendUp: isGrowthPositive },
        { label: 'Active Learners', value: data.active_users, icon: Activity, color: 'emerald', trend: `${platformScore}% Rate`, trendUp: true },
        { label: 'Courses/Quizzes', value: data.total_quizzes, icon: BookOpen, color: 'purple', trend: 'Stable', trendUp: null },
        { label: 'Total Points', value: data.total_points, icon: Award, color: 'orange', trend: 'Global', trendUp: true },
    ];

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
                    <StatsCard
                        key={idx}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        colorClass={stat.color}
                        tiltStrength={3}
                        subValue={
                            stat.trendUp !== null && (
                                <span className={`flex items-center gap-1 ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stat.trend}
                                    {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </span>
                            )
                        }
                    />
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

                    {/* Key Metrics Summary */}
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Growth</p>
                            <p className="text-lg font-bold text-emerald-600">{growthTrend}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Engagement</p>
                            <p className="text-lg font-bold text-indigo-600">{platformScore}%</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Churn</p>
                            <p className="text-lg font-bold text-rose-600">0%</p> {/* Placeholder until backend tracks churn */}
                        </div>
                    </div>
                </div>

                {/* Engagement Card */}
                <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Weekly Platform Score</h3>
                        <p className="text-indigo-100 mb-8 opacity-90">Overall health calculated from user engagement.</p>

                        <div className="flex items-end gap-2 mb-8">
                            <span className="text-6xl font-black">{platformScore}</span>
                            <span className="text-2xl font-bold opacity-80 mb-2">/100</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <span>{data.recent_admin_actions} admin actions this week</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Clock size={20} />
                                </div>
                                {/* TODO: Implement session tracking for real time */}
                                <span>Avg session time: ~15 mins</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDownloadReport}
                            className="mt-8 w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                        >
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
