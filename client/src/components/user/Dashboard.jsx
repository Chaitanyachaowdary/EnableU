import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Award, Zap, TrendingUp, BookOpen, CheckSquare, ChevronRight, RefreshCw, Trophy } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useApi } from '../../hooks/useApi';
import StatsCard from '../common/StatsCard';
import { SkeletonCard, SkeletonLeaderboard } from '../common/SkeletonLoaders';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [leaderboard, setLeaderboard] = useState([]);
    const [progress, setProgress] = useState(null);
    const { loading, error, request } = useApi();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { reduceMotion } = useAccessibility();

    // 3D Tilt Hook for cards
    const { ref: welcomeRef, style: welcomeStyle, onMouseMove: onWelcomeMove, onMouseLeave: onWelcomeLeave } = useTilt(5);
    const { ref: lbRef, style: lbStyle, onMouseMove: onLbMove, onMouseLeave: onLbLeave } = useTilt(8);

    const fetchData = async (manual = false) => {
        if (manual) setIsRefreshing(true);
        try {
            const [lbData, progressData] = await Promise.all([
                request('get', '/leaderboard'),
                request('get', '/progress')
            ]);

            setLeaderboard(lbData);
            setProgress(progressData);

            // Sync local storage
            const updatedUser = { ...user, gamification: { ...user.gamification, points: progressData.totalPoints } };
            localStorage.setItem('user', JSON.stringify(updatedUser));

        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            if (manual) setIsRefreshing(false);
        }
    };

    useEffect(() => {
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
            <header
                ref={!reduceMotion ? welcomeRef : null}
                style={!reduceMotion ? welcomeStyle : {}}
                onMouseMove={!reduceMotion ? onWelcomeMove : null}
                onMouseLeave={!reduceMotion ? onWelcomeLeave : null}
                className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden transition-transform duration-200 preserve-3d"
            >
                {/* Decorative 3D-ish background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                <div className="relative z-10 depth-layer-2">
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        Welcome back, {user.name || user.email?.split('@')[0]}!
                    </h1>
                    <p className="text-indigo-100 font-medium text-lg">You are on a streak! Keep learning to earn more badges.</p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <StatsCard
                        icon={Zap}
                        label="Total Points"
                        value={progress?.totalPoints || myStats.points}
                        colorClass="yellow"
                        tiltStrength={5}
                    />
                    <StatsCard
                        icon={Award}
                        label="Badges Earned"
                        value={progress?.totalBadges || myStats.badges}
                        colorClass="purple"
                        tiltStrength={5}
                    />
                    <StatsCard
                        icon={TrendingUp}
                        label="Course Progress"
                        value={`${progress?.completionPercentage || 0}%`}
                        colorClass="emerald"
                        tiltStrength={5}
                    />
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
                        <p className="text-sm text-gray-500 mb-6 -mt-3 ml-7">Resume your most recently accessed modules.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* In-Progress Items */}
                            {progress?.inProgress && progress.inProgress.length > 0 && (
                                progress.inProgress.map((item, idx) => (
                                    <div key={`ip-${idx}`} className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200 bg-indigo-50/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 truncate pr-2" title={item.quizTitle}>{item.quizTitle}</h3>
                                            <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                                                {item.currentIndex !== undefined && item.totalQuestions ? `${item.currentIndex + 1}/${item.totalQuestions}` : 'In Progress'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Last seen: {new Date(item.lastActivity).toLocaleDateString()}</p>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tight">
                                                <span>Question Progress</span>
                                                <span>{Math.round(((item.currentIndex || 0) / (item.totalQuestions || 1)) * 100)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                                    style={{ width: `${((item.currentIndex || 0) / (item.totalQuestions || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <Link
                                                to={`/quiz/${item.quizId}`}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                                            >
                                                Resume Quiz
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Completed Items (Recent Activity) */}
                            {progress?.recentActivity && progress.recentActivity.length > 0 ? (
                                progress.recentActivity.map((activity, idx) => {
                                    return (
                                        <div key={`comp-${idx}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 className="font-bold text-gray-900 truncate" title={activity.quizTitle}>{activity.quizTitle}</h3>
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

                    {/* Achievements Section - Relocated for prominence */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Award className="text-yellow-500" size={24} />
                                Your Achievements
                            </h2>
                            <Link to="/quizzes" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                Earn More <ChevronRight size={14} />
                            </Link>
                        </div>

                        {progress?.earnedBadges && progress.earnedBadges.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {progress.earnedBadges.map((badge, i) => (
                                    <div key={i} className="flex flex-col items-center p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100 group hover:border-yellow-300 transition-all hover:shadow-md" title={badge.description || badge.title}>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Award className="text-yellow-600" size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-yellow-800 text-center">{badge.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : myStats.badges > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {Array.from({ length: myStats.badges }).map((_, i) => (
                                    <div key={i} className="flex flex-col items-center p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100" title="Earned Badge">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                                            <Award className="text-yellow-600" size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-yellow-800 text-center">Badge #{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="text-gray-300" size={24} />
                                </div>
                                <p className="text-gray-600 font-bold">No achievements yet</p>
                                <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">Complete quizzes with a perfect score to earn exclusive badges!</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar / Leaderboard */}
                <div className="space-y-8">
                    {/* Leaderboard */}
                    <section
                        ref={!reduceMotion ? lbRef : null}
                        style={!reduceMotion ? lbStyle : {}}
                        onMouseMove={!reduceMotion ? onLbMove : null}
                        onMouseLeave={!reduceMotion ? onLbLeave : null}
                        className="glass-effect p-8 rounded-3xl shadow-2xl relative preserve-3d transition-transform duration-200 border border-white/40"
                    >
                        <div className="flex items-center justify-between mb-6 depth-layer-1">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                <Trophy className="text-yellow-500" /> Leaderboard
                            </h2>
                            <button
                                onClick={() => fetchData(true)}
                                className={`p-2 rounded-xl transition-all ${isRefreshing ? 'animate-spin' : 'hover:bg-gray-100'}`}
                                title="Refresh Leaderboard"
                            >
                                <RefreshCw size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {loading && !leaderboard.length ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-gray-100/50 animate-pulse rounded-2xl"></div>
                                    ))}
                                </div>
                            ) : leaderboard.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500 font-medium">No competition yet!</p>
                                </div>
                            ) : (
                                leaderboard.map((u, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all depth-layer-1
                                            ${u.email === user.email
                                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                                                : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`
                                                w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl font-black shadow-inner
                                                ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                    index === 1 ? 'bg-slate-200 text-slate-700' :
                                                        index === 2 ? 'bg-orange-200 text-orange-700' :
                                                            u.email === user.email ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}
                                            `}>
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`font-bold truncate ${u.email === user.email ? 'text-white' : 'text-gray-900'}`}>
                                                    {u.email.split('@')[0]}
                                                    {u.email === user.email && ' (You)'}
                                                </p>
                                                <p className={`text-xs ${u.email === user.email ? 'text-indigo-100' : 'text-gray-500'}`}>{u.badges} Achievements</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className={`text-sm font-black ${u.email === user.email ? 'text-white' : 'text-indigo-600'}`}>{u.points}</span>
                                            <span className={`block text-[10px] font-bold uppercase ${u.email === user.email ? 'text-indigo-200' : 'text-gray-400'}`}>PTS</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
