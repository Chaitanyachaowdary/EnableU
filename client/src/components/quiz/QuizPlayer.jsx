import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, ChevronRight, Award, Pause, Play } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const QuizPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { qId: optionId }
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { score, points, badges }
    const [isPaused, setIsPaused] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);

    // Accessibility hook for dynamic font and contrast adjustments if needed beyond CSS
    const { fontSize } = useAccessibility();

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    // Fetch Quiz
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/quizzes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuiz(response.data);
                setTimeLeft(response.data.timeLimit);

                // Mark quiz as started in progress tracking
                await axios.post('/api/progress/start', { quizId: id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Failed to fetch quiz', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    // Timer
    useEffect(() => {
        if (!quiz || result || timeLeft <= 0 || isPaused) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz, result, timeLeft, isPaused]);

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    // Arrow key navigation
    useEffect(() => {
        if (result || isPaused) return;

        const handleKeyDown = (e) => {
            const currentQuestion = quiz?.questions[currentQuestionIndex];
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
                    if (e.target.tagName !== 'BUTTON') { // Don't interfere with button clicks
                        e.preventDefault();
                        const selectedOption = currentQuestion.options[focusedOptionIndex];
                        handleOptionSelect(currentQuestion.id, selectedOption.id);
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [quiz, currentQuestionIndex, focusedOptionIndex, result, isPaused]);

    // Reset focused index when question changes
    useEffect(() => {
        setFocusedOptionIndex(0);
    }, [currentQuestionIndex]);

    const handleSubmit = useCallback(async () => {
        if (isSubmitting || result) return;
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/api/quizzes/${id}/submit`, { answers }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(response.data);
            setTimeLeft(0);
        } catch (error) {
            console.error('Failed to submit quiz', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [id, answers, isSubmitting, result]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="p-8 text-center">Loading quiz...</div>;
    if (!quiz) return <div className="p-8 text-center">Quiz not found.</div>;

    // Report Card View
    if (result) {
        return (
            <div className={`max-w-2xl mx-auto p-6 text-center ${fontSize > 100 ? 'max-w-4xl' : ''}`}> {/* Adjust width for large fonts */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <div className="text-center mb-8" role="status" aria-live="polite">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                            <Award size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            You scored {result.score} out of {result.totalQuestions * (quiz.points_reward / result.totalQuestions)} points
                        </p>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                            {result.correctCount} / {result.totalQuestions} correct answers
                        </p>
                        <span className="sr-only">
                            Quiz completed. Your score is {result.score} points. You answered {result.correctCount} out of {result.totalQuestions} questions correctly.
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <span className="block text-sm text-gray-500 dark:text-gray-400">Correct Answers</span>
                            <span className="block text-2xl font-bold text-gray-900 dark:text-white">{result.correctCount} / {result.totalQuestions}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <span className="block text-sm text-gray-500 dark:text-gray-400">Points Earned</span>
                            <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">+{result.score}</span>
                        </div>
                    </div>

                    {result.badges && result.badges.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Badges Earned</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {result.badges.map((badge, idx) => (
                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <Award size={12} className="mr-1" />
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Review Section */}
                    <div className="text-left mb-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review Answers</h3>
                        <div className="space-y-4">
                            {result.feedback && result.feedback.map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border-l-4 ${item.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} dark:bg-gray-900`}>
                                    <p className="font-medium text-gray-900 dark:text-white mb-2">{idx + 1}. {item.questionText}</p>

                                    <div className="text-sm space-y-1">
                                        <p className={`${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            <strong>Your Answer:</strong> {item.userOptionText}
                                        </p>
                                        {!item.isCorrect && (
                                            <p className="text-green-700">
                                                <strong>Correct Answer:</strong> {item.correctOptionText}
                                            </p>
                                        )}
                                    </div>

                                    {item.explanation && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 italic">
                                            <strong>Explanation:</strong> {item.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/quizzes')}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible-custom"
                    >
                        Back to Modules
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={togglePause}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible-custom"
                        aria-label={isPaused ? "Resume Quiz" : "Pause Quiz"}
                    >
                        {isPaused ? <Play size={24} className="text-green-600" /> : <Pause size={24} className="text-gray-600 dark:text-gray-300" />}
                    </button>

                    <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'} dark:bg-gray-800 dark:text-gray-200`}
                        role="timer"
                        aria-live="polite"
                    >
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            {/* Paused Overlay */}
            {isPaused ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Pause size={48} className="mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Paused</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Take a break! The timer is stopped.</p>
                    <button
                        onClick={togglePause}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-visible-custom font-medium"
                    >
                        Resume Quiz
                    </button>
                </div>
            ) : (
                /* Question Card */
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                        {currentQuestion.text}
                    </h2>

                    <div className="space-y-4" role="radiogroup" aria-labelledby={`q-${currentQuestion.id}`}>
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = answers[currentQuestion.id] === option.id;
                            const isFocused = idx === focusedOptionIndex;
                            return (
                                <label
                                    key={option.id}
                                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        } ${isFocused && !isSelected ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={option.id}
                                        checked={isSelected}
                                        onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 focus-visible-custom"
                                    />
                                    <span className="ml-3 text-gray-900 dark:text-gray-200">{option.text}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            {!isPaused && (
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible-custom dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus-visible-custom"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible-custom"
                        >
                            Next <ChevronRight size={16} className="ml-2" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizPlayer;
