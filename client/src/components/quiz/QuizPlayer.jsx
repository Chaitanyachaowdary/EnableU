import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ChevronRight, Award, Pause, Play, BookOpen } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useApi } from '../../hooks/useApi';
import { useTilt } from '../../hooks/useTilt';

// 3D Timer Component
const TimerRing3D = ({ timeLeft, totalTime = 30 }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;
    const isCritical = timeLeft <= 10;

    return (
        <div className="relative w-16 h-16 flex items-center justify-center perspective-container">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 60 60">
                <circle
                    cx="30" cy="30" r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700 opacity-30"
                />
                <circle
                    cx="30" cy="30" r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`transition-all duration-1000 ease-linear ${isCritical ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-gray-700 dark:text-gray-200">
                {timeLeft}s
            </div>

            {/* 3D Floating Rings Effect */}
            <div className={`absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-ping ${isCritical ? 'animation-delay-200' : 'hidden'}`} style={{ animationDuration: '1s' }}></div>
        </div>
    );
};

const QuizPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { qId: optionId }
    const [timeLeft, setTimeLeft] = useState(30);
    const [result, setResult] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { request, loading } = useApi();
    const { request: submitReq, loading: isSubmitting } = useApi();
    const { ref: cardRef, style: cardStyle, onMouseMove, onMouseLeave } = useTilt(5);
    const { fontSize } = useAccessibility();

    const togglePause = () => setIsPaused(!isPaused);

    // Fetch Quiz
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizData = await request('get', `/quizzes/${id}`);
                setQuiz(quizData);
                // Trigger backend start
                await request('post', '/progress/start', { quizId: id });
            } catch (error) {
                console.error('Failed to fetch quiz', error);
            }
        };
        fetchQuiz();
    }, [id, request]);

    // Timer Logic: Per Question (30s)
    useEffect(() => {
        if (!quiz || result || isPaused || isTransitioning) return;

        // Reset timer when question changes
        setTimeLeft(slug => {
            // If we just started a new question, ensure it's 30. 
            // But this runs on every render. We need a separate effect for reset.
            return slug;
        });

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoAdvance();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz, result, isPaused, isTransitioning, currentQuestionIndex]);

    // Separate effect to reset timer on question change
    useEffect(() => {
        setTimeLeft(30);
        setFocusedOptionIndex(0);
        setIsTransitioning(false);

        // Sync progress index to backend
        if (quiz && !result) {
            request('post', '/progress/start', {
                quizId: id,
                currentQuestionIndex: currentQuestionIndex
            }).catch(err => console.error('Failed to sync progress', err));
        }
    }, [currentQuestionIndex, id, quiz, result, request]);

    const handleAutoAdvance = () => {
        if (!quiz) return;

        setIsTransitioning(true);
        setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                handleSubmit();
            }
        }, 800); // Wait for transition animation
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 300);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev - 1);
            }, 300);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (isSubmitting || result) return;

        try {
            const resultData = await submitReq('post', `/quizzes/${id}/submit`, { answers });
            setResult(resultData);
        } catch (error) {
            console.error('Failed to submit quiz', error);
        }
    }, [id, answers, isSubmitting, result, submitReq]);

    // Keyboard Navigation
    useEffect(() => {
        if (result || isPaused || !quiz) return;

        const handleKeyDown = (e) => {
            const currentQuestion = quiz.questions[currentQuestionIndex];
            if (!currentQuestion) return;
            const optionCount = currentQuestion.options.length;

            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    setFocusedOptionIndex(prev => (prev + 1) % optionCount);
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    setFocusedOptionIndex(prev => (prev - 1 + optionCount) % optionCount);
                    break;
                case 'Enter':
                case ' ':
                    if (e.target.tagName !== 'BUTTON') {
                        e.preventDefault();
                        const selectedOption = currentQuestion.options[focusedOptionIndex];
                        handleOptionSelect(currentQuestion.id, selectedOption.id);
                    }
                    break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [quiz, currentQuestionIndex, focusedOptionIndex, result, isPaused]);

    if (loading || !quiz) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-gray-500">Loading Assessment...</p>
        </div>
    );

    // Results View
    if (result) {
        return (
            <div className={`max-w-3xl mx-auto p-6 animate-fade-in-3d ${fontSize > 100 ? 'max-w-4xl' : ''}`}>
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="relative p-10 text-center text-white bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
                        {/* 3D Background Elements for Results */}
                        <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/2 -translate-y-1/2">
                            <svg width="300" height="300" viewBox="0 0 100 100" className="animate-spin-slow">
                                <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                            </svg>
                        </div>

                        <div className="relative z-10">
                            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                                <Award size={56} className="text-yellow-300 drop-shadow-md" />
                            </div>
                            <h2 className="text-4xl font-black mb-2 tracking-tight">Quiz Complete!</h2>
                            <p className="text-indigo-100 text-lg font-medium">Here is how you performed</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-indigo-50 dark:bg-gray-700/50 p-6 rounded-2xl text-center">
                                <span className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Score</span>
                                <span className="block text-4xl font-black text-indigo-600 dark:text-indigo-400">{result.score} pts</span>
                            </div>
                            <div className="bg-emerald-50 dark:bg-gray-700/50 p-6 rounded-2xl text-center">
                                <span className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Accuracy</span>
                                <span className="block text-4xl font-black text-emerald-600 dark:text-emerald-400">{result.correctCount}/{result.totalQuestions}</span>
                            </div>
                        </div>

                        {/* Badges */}
                        {result.badges?.length > 0 && (
                            <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
                                <h3 className="flex items-center gap-2 text-yellow-800 dark:text-yellow-500 font-bold mb-4">
                                    <Award size={20} /> New Badges Unlocked!
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {result.badges.map((badge, idx) => (
                                        <span key={idx} className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-700">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/quizzes')}
                            className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition-all"
                        >
                            Return to Modules
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 perspective-container min-h-screen flex flex-col justify-center">
            {/* Header: Timer & Progress */}
            <div className="flex items-center justify-between mb-8 depth-layer-2 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center font-black text-gray-400">
                        {currentQuestionIndex + 1}
                    </div>
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={togglePause}
                        className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label={isPaused ? "Resume" : "Pause"}
                    >
                        {isPaused ? <Play size={20} className="text-green-600 fill-current" /> : <Pause size={20} className="text-gray-400 fill-current" />}
                    </button>

                    {/* 3D Timer Ring */}
                    <TimerRing3D timeLeft={timeLeft} />
                </div>
            </div>

            {/* Paused Overlay */}
            {isPaused && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm animate-fade-in-3d">
                    <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl skew-y-1">
                        <Pause size={64} className="mx-auto text-indigo-600 mb-6" />
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Quiz Paused</h2>
                        <button
                            onClick={togglePause}
                            className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                        >
                            Resume Now
                        </button>
                    </div>
                </div>
            )}

            {/* 3D Question Card */}
            <div
                ref={cardRef}
                style={cardStyle}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                className={`glass-effect rounded-[2.5rem] shadow-2xl border-white/40 p-10 md:p-14 mb-8 preserve-3d transition-all duration-500 ease-out 
                    ${isTransitioning ? 'opacity-0 translate-y-10 rotate-x-20 scale-95' : 'opacity-100 translate-y-0 rotate-x-0 scale-100'}`}
            >
                <div className="flex items-start gap-6 mb-10 depth-layer-2">
                    <div className="hidden md:flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shrink-0">
                        <BookOpen size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tight depth-3d-text">
                        {currentQuestion.text}
                    </h2>
                </div>

                <div className="grid gap-4 depth-layer-1" role="radiogroup">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = answers[currentQuestion.id] === option.id;
                        const isFocused = idx === focusedOptionIndex;

                        return (
                            <label
                                key={option.id}
                                className={`group relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 preserve-3d
                                    ${isSelected
                                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-900/30 shadow-md translate-z-4'
                                        : 'border-slate-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                                    } ${isFocused ? 'ring-4 ring-indigo-500/20' : ''}`}
                                style={{ transform: isSelected ? 'translateZ(20px)' : 'translateZ(0)' }}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-5 transition-colors
                                    ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>

                                <input
                                    type="radio"
                                    name={`question-${currentQuestion.id}`}
                                    value={option.id}
                                    checked={isSelected}
                                    onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                                    className="sr-only"
                                />
                                <span className="text-lg font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                    {option.text}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="flex justify-between items-center px-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                    <div className="p-1 rounded-lg bg-gray-100"><ChevronRight size={16} className="rotate-180" /></div>
                    Previous
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 text-white font-black shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                        <span>Submit Assessment</span>
                        <CheckCircle size={20} />
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                        <span>Next Question</span>
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizPlayer;
