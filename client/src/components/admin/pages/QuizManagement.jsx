import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit, X, Save,
    Download, BookOpen, Clock, Award
} from 'lucide-react';
import Toast from '../../common/Toast';
import ConfirmDialog from '../../common/ConfirmDialog';
import { useApi } from '../../../hooks/useApi';
import { SkeletonLeaderboard } from '../../common/SkeletonLoaders';

const QuizManagement = () => {
    const { request, loading, error } = useApi();
    const { request: actionReq, loading: actionLoading } = useApi();

    const [quizzes, setQuizzes] = useState([]);
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [quizForm, setQuizForm] = useState({
        id: '',
        title: '',
        description: '',
        time_limit: 300,
        points_reward: 100,
        questions: [{
            text: '',
            options: [
                { id: 1, text: '', is_correct: false },
                { id: 2, text: '', is_correct: false },
                { id: 3, text: '', is_correct: false },
                { id: 4, text: '', is_correct: false }
            ],
            explanation: ''
        }]
    });

    useEffect(() => {
        fetchQuizzes();
    }, [request]);

    const fetchQuizzes = async () => {
        try {
            const data = await request('get', '/quizzes');
            setQuizzes(data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            // Error is handled by useApi but custom toast offers better UX here
            setToast({ message: 'Failed to fetch quizzes', type: 'error' });
        }
    };

    const handleDeleteQuiz = (quizId, quizTitle) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Quiz',
            message: `Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`,
            type: 'danger',
            onConfirm: async () => {
                try {
                    await actionReq('delete', `/admin/quizzes/${quizId}`);
                    setQuizzes(quizzes.filter(q => q.id !== quizId));
                    setToast({ message: 'Quiz deleted successfully', type: 'success' });
                } catch (error) {
                    setToast({ message: 'Failed to delete quiz', type: 'error' });
                } finally {
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const handleEditQuiz = (quiz) => {
        setQuizForm({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            time_limit: quiz.timeLimit || quiz.time_limit,
            points_reward: quiz.points_reward,
            questions: quiz.questions.map(q => ({
                text: q.text,
                options: q.options || [],
                explanation: q.explanation || ''
            }))
        });
        setIsEditMode(true);
        setShowQuizForm(true);
    };

    const handleSaveQuiz = async () => {
        if (!quizForm.title || !quizForm.description) {
            setToast({ message: 'Title and description are required', type: 'error' });
            return;
        }

        try {
            const url = isEditMode ? `/admin/quizzes/${quizForm.id}` : '/admin/quizzes';
            const method = isEditMode ? 'put' : 'post';

            const response = await actionReq(method, url, quizForm);

            setToast({ message: `Quiz ${isEditMode ? 'updated' : 'created'} successfully`, type: 'success' });
            setShowQuizForm(false);
            resetForm();

            // If created, append. If updated, replace.
            if (isEditMode) {
                setQuizzes(quizzes.map(q => q.id === quizForm.id ? response.quiz : q));
                // Reloading all to ensure consistency is safer though
                fetchQuizzes();
            } else {
                fetchQuizzes();
            }

        } catch (error) {
            setToast({ message: `Failed to ${isEditMode ? 'update' : 'create'} quiz`, type: 'error' });
        }
    };

    const resetForm = () => {
        setIsEditMode(false);
        setQuizForm({
            id: '',
            title: '',
            description: '',
            time_limit: 300,
            points_reward: 100,
            questions: [{
                text: '',
                options: [
                    { id: 1, text: '', is_correct: false },
                    { id: 2, text: '', is_correct: false },
                    { id: 3, text: '', is_correct: false },
                    { id: 4, text: '', is_correct: false }
                ],
                explanation: ''
            }]
        });
    };

    const addQuestion = () => {
        setQuizForm({
            ...quizForm,
            questions: [...quizForm.questions, {
                text: '',
                options: [
                    { id: 1, text: '', is_correct: false },
                    { id: 2, text: '', is_correct: false },
                    { id: 3, text: '', is_correct: false },
                    { id: 4, text: '', is_correct: false }
                ],
                explanation: ''
            }]
        });
    };

    const removeQuestion = (index) => {
        if (quizForm.questions.length > 1) {
            const updated = quizForm.questions.filter((_, i) => i !== index);
            setQuizForm({ ...quizForm, questions: updated });
        }
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...quizForm.questions];
        updated[index][field] = value;
        setQuizForm({ ...quizForm, questions: updated });
    };

    const updateOption = (qIdx, oIdx, field, value) => {
        const updated = [...quizForm.questions];
        updated[qIdx].options[oIdx][field] = value;
        setQuizForm({ ...quizForm, questions: updated });
    };

    if (loading && quizzes.length === 0) return <SkeletonLeaderboard />;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                type={confirmDialog.type}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Management</h2>
                    <p className="text-sm text-gray-500">Create and curate learning modules for students.</p>
                </div>
                <button
                    onClick={() => setShowQuizForm(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-semibold shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    New Module
                </button>
            </div>

            {showQuizForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/30 overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-indigo-50/30 dark:bg-indigo-900/10">
                        <h3 className="font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Module' : 'Create New Module'}</h3>
                        <button onClick={() => setShowQuizForm(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Module Title</label>
                                    <input
                                        type="text"
                                        value={quizForm.title}
                                        onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Accessibility Basics"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Time Limit (secs)</label>
                                    <input
                                        type="number"
                                        value={quizForm.time_limit}
                                        onChange={(e) => setQuizForm({ ...quizForm, time_limit: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Points Reward</label>
                                    <input
                                        type="number"
                                        value={quizForm.points_reward}
                                        onChange={(e) => setQuizForm({ ...quizForm, points_reward: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={quizForm.description}
                                        onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="What will users learn?"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-t pt-6 border-gray-100">
                                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BookOpen size={18} className="text-indigo-600" />
                                    Questions ({quizForm.questions.length})
                                </h4>
                                <button onClick={addQuestion} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                                    + Add Question
                                </button>
                            </div>
                            {quizForm.questions.map((q, qIdx) => (
                                <div key={qIdx} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <input
                                            type="text"
                                            value={q.text}
                                            onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                                            className="font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 w-full mr-4 outline-none focus:border-indigo-500"
                                            placeholder={`Question ${qIdx + 1}`}
                                        />
                                        <button onClick={() => removeQuestion(qIdx)} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((o, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={o.is_correct}
                                                    onChange={(e) => updateOption(qIdx, oIdx, 'is_correct', e.target.checked)}
                                                    className="w-4 h-4 rounded text-indigo-600"
                                                />
                                                <input
                                                    type="text"
                                                    value={o.text}
                                                    onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                                                    className="w-full text-sm outline-none dark:bg-gray-800 dark:text-gray-300"
                                                    placeholder={`Option ${oIdx + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={q.explanation}
                                        onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                                        className="w-full text-xs italic bg-transparent border-none outline-none text-gray-500"
                                        placeholder="Optional: Why is this the correct answer?"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/30 dark:bg-gray-900/10">
                        <button onClick={() => setShowQuizForm(false)} className="px-6 py-2 font-semibold text-gray-600 hover:text-gray-900">Cancel</button>
                        <button disabled={actionLoading} onClick={handleSaveQuiz} className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-all disabled:opacity-50">
                            {actionLoading ? 'Saving...' : (isEditMode ? 'Update Module' : 'Save Module')}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map(quiz => (
                    <div key={quiz.id} className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <BookOpen size={24} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditQuiz(quiz)} className="p-2 text-gray-400 hover:text-indigo-600"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteQuiz(quiz.id, quiz.title)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{quiz.description}</p>
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                <Clock size={14} />
                                {Math.floor(quiz.timeLimit / 60) || Math.floor(quiz.time_limit / 60)}m
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                <Award size={14} />
                                {quiz.points || quiz.points_reward} pts
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizManagement;
