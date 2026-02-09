import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, Award, ChevronRight } from 'lucide-react';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/quizzes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuizzes(response.data);
            } catch (error) {
                console.error('Failed to fetch quizzes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading quizzes...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Modules</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Select a quiz to test your knowledge and earn points.</p>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus-visible-custom dark:bg-gray-800 dark:text-white"
                        aria-label="Search quizzes"
                    />
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredQuizzes.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                        No quizzes found matching "{searchTerm}".
                    </div>
                ) : (
                    filteredQuizzes.map(quiz => (
                        <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
                            <div className="p-6 flex-1">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h2>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{quiz.description}</p>

                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{Math.floor(quiz.timeLimit / 60)} mins</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Award size={16} />
                                        <span>{quiz.points} pts</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 rounded-b-lg">
                                <Link
                                    to={`/quizzes/${quiz.id}`}
                                    className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 focus-visible-custom rounded p-1"
                                    aria-label={`Start quiz: ${quiz.title}`}
                                >
                                    Start Quiz
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QuizList;
