import React, { useState, useEffect } from 'react';

import { TrendingUp, Clock, Award, Target, Activity, ChevronLeft } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import StatsCard from '../common/StatsCard';
import { useTilt } from '../../hooks/useTilt';
import { SkeletonCard } from '../common/SkeletonLoaders';

const ProgressDashboard = () => {
    const [progress, setProgress] = useState(null);
    const { loading, error, request } = useApi();
    const { reduceMotion } = useAccessibility();

    // 3D Tilt Hook for activity section
    const { ref: activityRef, style: activityStyle, onMouseMove: onActivityMove, onMouseLeave: onActivityLeave } = useTilt(3);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await request('get', '/progress');
                setProgress(data);
            } catch (err) {
                console.error('Failed to fetch progress', err);
            }
        };
        fetchProgress();
    }, [request]);

    if (loading && !progress) {
        return (
            <div className="p-6 max-w-6xl mx-auto space-y-10">
                <div className="w-64 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    if (!progress) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">No progress data available.</div>;
    }

    const formatTime = (seconds) => {
        if (!seconds) return '0m';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-10 relative z-10">
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Your Progress</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Track your learning journey and achievements</p>
                </div>
                <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                    <ChevronLeft size={20} /> Back to Dashboard
                </Link>
            </header>

            {error && (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8 font-bold">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Target}
                    label="Completion Rate"
                    value={`${progress.completionPercentage}%`}
                    subValue={`${progress.completedQuizzes} / ${progress.totalQuizzes} modules`}
                    colorClass="indigo"
                />
                <StatsCard
                    icon={TrendingUp}
                    label="Average Score"
                    value={progress.averageScore}
                    subValue="Overall Quality"
                    colorClass="emerald"
                />
                <StatsCard
                    icon={Clock}
                    label="Learning Time"
                    value={formatTime(progress.totalTimeSpent)}
                    subValue="Total investment"
                    colorClass="blue"
                />
                <StatsCard
                    icon={Award}
                    label="Total Points"
                    value={progress.totalPoints}
                    subValue={`${progress.totalBadges} achievements earned`}
                    colorClass="yellow"
                />
            </div>

            {/* Recent Activity */}
            <div
                ref={!reduceMotion ? activityRef : null}
                style={!reduceMotion ? activityStyle : {}}
                onMouseMove={!reduceMotion ? onActivityMove : null}
                onMouseLeave={!reduceMotion ? onActivityLeave : null}
                className="glass-effect rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50 preserve-3d transition-transform duration-200"
            >
                <div className="flex items-center gap-3 mb-8 depth-layer-1">
                    <Activity size={24} className="text-indigo-600" />
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Recent Activity</h2>
                </div>

                {progress.recentActivity.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 depth-layer-1">
                        <p className="text-gray-500 font-medium">No quiz activity yet. Start your first quiz to track progress!</p>
                    </div>
                ) : (
                    <div className="space-y-4 depth-layer-2">
                        {progress.recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-6 bg-white/60 hover:bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {activity.quizTitle}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium">
                                            {activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 'N/A'}
                                            {activity.timeSpent && ` • ${formatTime(activity.timeSpent)}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                        {activity.score}
                                    </span>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Motivational Section */}
            {progress.completionPercentage < 100 && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2">Keep Going! 🎯</h3>
                        <p className="text-indigo-100 font-medium">
                            You've mastered {progress.completedQuizzes} modules.
                            Only {progress.totalQuizzes - progress.completedQuizzes} more to reach your goal!
                        </p>
                    </div>
                </div>
            )}

            {progress.completionPercentage === 100 && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">🎉 Congratulations!</h3>
                    <p className="text-green-100">
                        You've completed all available quizzes! Keep practicing to maintain your skills.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProgressDashboard;
