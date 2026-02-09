import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Award, Zap, TrendingUp, BookOpen, CheckSquare, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [leaderboard, setLeaderboard] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [lbResponse, progressRes] = await Promise.all([
                    axios.get('/api/leaderboard', config),
                    axios.get('/api/progress', config)
                ]);

                setLeaderboard(lbResponse.data);
                setProgress(progressRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Mock stats based on local user + leaderboard
    const myStats = leaderboard.find(u => u.email === user.email) || {
        points: user.gamification?.points || 0,
        badges: user.gamification?.badges?.length || 0
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            {/* Welcome Section */}
            <header className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user.name || user.email?.split('@')[0]}!
                </h1>
                <p className="opacity-90">You are on a streak! Keep learning to earn more badges.</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-yellow-400 rounded-lg text-yellow-900">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-sm opacity-75">Total Points</p>
                            <p className="text-2xl font-bold">{progress?.totalPoints || myStats.points}</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-purple-400 rounded-lg text-purple-900">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-sm opacity-75">Badges Earned</p>
                            <p className="text-2xl font-bold">{progress?.totalBadges || myStats.badges}</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-green-400 rounded-lg text-green-900">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm opacity-75">Course Completion</p>
                            <p className="text-2xl font-bold">{progress?.completionPercentage || 0}%</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="text-indigo-600" />
                            Continue Learning
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* In-Progress Items */}
                            {progress?.inProgress && progress.inProgress.length > 0 && (
                                progress.inProgress.map((item, idx) => (
                                    <div key={`ip-${idx}`} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200 bg-indigo-50/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900">{item.quizTitle}</h3>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">In Progress</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Last seen: {new Date(item.lastActivity).toLocaleDateString()}</p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <Link to={`/quizzes/${item.quizId}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Continue <ChevronRight size={14} className="inline" /></Link>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Completed Items (Recent Activity) */}
                            {progress?.recentActivity && progress.recentActivity.length > 0 ? (
                                progress.recentActivity.map((activity, idx) => {
                                    // Don't show if already in the In-Progress list (though submission should clear that)
                                    return (
                                        <div key={`comp-${idx}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="font-bold text-gray-900">{activity.quizTitle}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Last completed: {new Date(activity.completedAt).toLocaleDateString()}</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-sm font-medium text-emerald-600">Score: {activity.score}</span>
                                                <Link to="/quizzes" className="text-xs font-bold text-gray-600 hover:text-indigo-600">Retake</Link>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (!progress?.inProgress || progress.inProgress.length === 0) && (
                                <>
                                    <Link to="/quizzes" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-colors">
                                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Accessibility Fundamentals</h3>
                                        <p className="text-sm text-gray-500 mt-2">Start your learning journey.</p>
                                        <div className="mt-4 flex items-center gap-2 text-indigo-600 font-medium">
                                            Start <ChevronRight size={14} />
                                        </div>
                                    </Link>
                                    <Link to="/quizzes" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-colors">
                                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">View All Modules</h3>
                                        <p className="text-sm text-gray-500 mt-2">Explore the curriculum.</p>
                                        <div className="mt-4 flex items-center gap-2 text-indigo-600 font-medium">
                                            Explore <ChevronRight size={14} />
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar / Leaderboard */}
                <div className="space-y-8">
                    {/* Leaderboard */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Top 10</span>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-gray-500 text-sm">Loading...</p>
                            ) : leaderboard.length === 0 ? (
                                <p className="text-gray-500 text-sm">No data yet.</p>
                            ) : (
                                leaderboard.map((u, index) => (
                                    <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${u.email === user.email ? 'bg-indigo-50 border border-indigo-100' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
                                                ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}
                                            `}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${u.email === user.email ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                    {u.email.split('@')[0]}
                                                    {u.email === user.email && ' (You)'}
                                                </p>
                                                <p className="text-xs text-gray-500">{u.badges} Badges</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600">{u.points} pts</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Badges Section */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="text-yellow-500" size={20} />
                            Your Achievements
                        </h2>
                        {myStats.badges > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {/* We only have counts or generic names for now, relying on local formatting */}
                                {Array.from({ length: myStats.badges }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200" title="Earned Badge">
                                        <Award size={12} />
                                        <span>Badge #{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <p className="text-sm text-gray-500 mb-2">No badges yet</p>
                                <p className="text-xs text-gray-400">Complete quizzes with 100% score to earn badges!</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
