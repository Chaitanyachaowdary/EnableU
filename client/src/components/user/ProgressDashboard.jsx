import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, Award, Target, Activity } from 'lucide-react';

const ProgressDashboard = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProgress(response.data);
            } catch (error) {
                console.error('Failed to fetch progress', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading progress...</div>;
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
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Progress</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your learning journey and achievements</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Completion Rate */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Target className="text-indigo-600 dark:text-indigo-400" size={24} />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {progress.completionPercentage}%
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {progress.completedQuizzes} / {progress.totalQuizzes} quizzes
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.completionPercentage}%` }}
                            role="progressbar"
                            aria-valuenow={progress.completionPercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                    </div>
                </div>

                {/* Average Score */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {progress.averageScore}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Per quiz completion
                    </p>
                </div>

                {/* Time Spent */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatTime(progress.totalTimeSpent)}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Spent Learning</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Total quiz time
                    </p>
                </div>

                {/* Total Points */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Award className="text-yellow-600 dark:text-yellow-400" size={24} />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {progress.totalPoints}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Points</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {progress.totalBadges} badges earned
                    </p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Activity size={20} className="text-gray-600 dark:text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                </div>

                {progress.recentActivity.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No quiz activity yet. Start your first quiz to track progress!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {progress.recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {activity.quizTitle}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 'N/A'}
                                        {activity.timeSpent && ` • ${formatTime(activity.timeSpent)}`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                        {activity.score} pts
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Motivational Section */}
            {progress.completionPercentage < 100 && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Keep Going! 🎯</h3>
                    <p className="text-indigo-100">
                        You've completed {progress.completedQuizzes} quizzes.
                        Only {progress.totalQuizzes - progress.completedQuizzes} more to go!
                    </p>
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
