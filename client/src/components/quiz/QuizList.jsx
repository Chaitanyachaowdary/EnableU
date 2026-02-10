import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Award, ChevronRight, Search, BookOpen } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { SkeletonCard } from '../common/SkeletonLoaders';
import { useTilt } from '../../hooks/useTilt';

/**
 * QuizCard Component - Senior Implementation
 * Uses 3D tilt, glassmorphism, and staggered animations.
 */
const QuizCard = ({ quiz, index }) => {
    const { ref, style, onMouseMove, onMouseLeave } = useTilt(10);
    const delayClass = `delay-${(index % 5) * 100 + 100}`;

    return (
        <div
            ref={ref}
            style={style}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`glass-effect rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-all preserve-3d group animate-slide-up-fade ${delayClass} opacity-100`}
        >
            <div className="bg-white/40 backdrop-blur-md rounded-[22px] p-6 h-full flex flex-col preserve-3d">
                <div className="flex-1 depth-layer-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <BookOpen size={20} />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            <Award size={12} />
                            <span>{quiz.points} PTS</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {quiz.title}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6">
                        {quiz.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-indigo-400" />
                            <span>{Math.floor(quiz.timeLimit / 60)} MINS</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100/50 depth-layer-2">
                    <Link
                        to={`/quizzes/${quiz.id}`}
                        className="flex items-center justify-between w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                        <span>Start Learning</span>
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const QuizList = () => {
    const { request, loading, error } = useApi();
    const [quizzes, setQuizzes] = useState([]);
    const { reduceMotion, highContrast } = useAccessibility();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await request('get', '/quizzes');
                setQuizzes(data);
            } catch (err) {
                console.error('Failed to load quizzes', err);
            }
        };
        fetchQuizzes();
    }, [request]);

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto perspective-container">
            <header className="mb-12 animate-slide-up-fade opacity-100">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            <BookOpen size={14} />
                            <span>Academic Path</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">Learning Modules</h1>
                        <p className="text-lg text-gray-500 font-medium">Select a quiz to test your knowledge and earn points.</p>
                    </div>

                    <div className="relative w-full max-w-sm group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 glass-effect border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium premium-input"
                            aria-label="Search quizzes"
                        />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 preserve-3d">
                    {filteredQuizzes.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No quizzes found matching "{searchTerm}".
                        </div>
                    ) : (
                        filteredQuizzes.map((quiz, idx) => (
                            <QuizCard key={quiz.id} quiz={quiz} index={idx} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizList;
