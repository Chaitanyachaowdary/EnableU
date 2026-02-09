import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Users, BookOpen, Award, TrendingUp, Plus, Trash2, Edit, X, Save,
    ChevronDown, ChevronUp, Search, Filter, Download, CheckSquare,
    Square, AlertCircle, CheckCircle, XCircle, Info
} from 'lucide-react';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />
    };

    const colors = {
        success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
        info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800'
    };

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${colors[type]}`}>
            {icons[type]}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) => {
    if (!isOpen) return null;

    const buttonColors = {
        danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
        warning: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800',
        info: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-scale-in">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors ${buttonColors[type]}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Show</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span>per page</span>
                <span className="ml-4">
                    Showing {startItem}-{endItem} of {totalItems}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                    First
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                    Prev
                </button>
                <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                    Next
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                    Last
                </button>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(false);

    // Toast notifications
    const [toast, setToast] = useState(null);

    // Confirmation dialog
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });

    // Search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [sortBy, setSortBy] = useState('email');
    const [sortOrder, setSortOrder] = useState('asc');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Bulk operations
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [bulkRole, setBulkRole] = useState('student');

    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/', { replace: true });
            return;
        }
    }, [user.role, navigate]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Quiz creation state
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [quizForm, setQuizForm] = useState({
        title: '',
        description: '',
        time_limit: 300,
        points_reward: 100,
        questions: [
            {
                text: '',
                options: [
                    { id: 1, text: '', is_correct: false },
                    { id: 2, text: '', is_correct: false },
                    { id: 3, text: '', is_correct: false },
                    { id: 4, text: '', is_correct: false }
                ],
                explanation: ''
            }
        ]
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const showConfirm = (title, message, onConfirm, type = 'danger') => {
        setConfirmDialog({ isOpen: true, title, message, onConfirm, type });
    };

    const closeConfirm = () => {
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === 'users') {
                const response = await axios.get('/api/admin/users', config);
                setUsers(response.data);
            } else if (activeTab === 'quizzes') {
                const response = await axios.get('/api/quizzes', config);
                setQuizzes(response.data);
            } else if (activeTab === 'overview') {
                const [usersRes, quizzesRes] = await Promise.all([
                    axios.get('/api/admin/users', config),
                    axios.get('/api/quizzes', config)
                ]);
                setUsers(usersRes.data);
                setQuizzes(quizzesRes.data);
                setAnalytics({
                    totalUsers: usersRes.data.length,
                    totalQuizzes: quizzesRes.data.length,
                    activeUsers: usersRes.data.filter(u => (u.gamification?.points || 0) > 0).length,
                    totalPoints: usersRes.data.reduce((sum, u) => sum + (u.gamification?.points || 0), 0)
                });
            }
            showToast('Data loaded successfully', 'success');
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            showToast(`User role updated to ${newRole}`, 'success');
        } catch (error) {
            console.error('Error updating role:', error);
            showToast('Failed to update user role', 'error');
        }
    };

    const handleDeleteQuiz = (quizId, quizTitle) => {
        showConfirm(
            'Delete Quiz',
            `Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`,
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`/api/admin/quizzes/${quizId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setQuizzes(quizzes.filter(q => q.id !== quizId));
                    showToast('Quiz deleted successfully', 'success');
                } catch (error) {
                    console.error('Error deleting quiz:', error);
                    showToast('Failed to delete quiz', 'error');
                } finally {
                    closeConfirm();
                }
            },
            'danger'
        );
    };

    // Bulk operations
    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredAndSortedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredAndSortedUsers.map(u => u.id));
        }
    };

    const handleBulkRoleUpdate = () => {
        if (selectedUsers.length === 0) {
            showToast('Please select users first', 'warning');
            return;
        }

        showConfirm(
            'Bulk Role Update',
            `Are you sure you want to update ${selectedUsers.length} user(s) to ${bulkRole} role?`,
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await Promise.all(
                        selectedUsers.map(userId =>
                            axios.put(`/api/admin/users/${userId}/role`, { role: bulkRole }, {
                                headers: { Authorization: `Bearer ${token}` }
                            })
                        )
                    );
                    setUsers(users.map(u =>
                        selectedUsers.includes(u.id) ? { ...u, role: bulkRole } : u
                    ));
                    setSelectedUsers([]);
                    showToast(`Updated ${selectedUsers.length} users successfully`, 'success');
                } catch (error) {
                    console.error('Error bulk updating roles:', error);
                    showToast('Failed to update user roles', 'error');
                } finally {
                    closeConfirm();
                }
            },
            'warning'
        );
    };

    // CSV Export functionality
    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) {
            showToast('No data to export', 'warning');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' && value.includes(',')
                        ? `"${value}"`
                        : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        showToast('Data exported successfully', 'success');
    };

    const exportUsers = () => {
        const exportData = users.map(u => ({
            Email: u.email,
            Role: u.role,
            Points: u.gamification?.points || 0,
            Badges: u.gamification?.badges?.length || 0,
            Joined: new Date(u.created_at || '').toLocaleDateString()
        }));
        exportToCSV(exportData, 'users');
    };

    const exportQuizzes = () => {
        const exportData = quizzes.map(q => ({
            Title: q.title,
            Description: q.description,
            'Time Limit': q.timeLimit || q.time_limit,
            Points: q.points || q.points_reward,
            Questions: q.questions?.length || 0
        }));
        exportToCSV(exportData, 'quizzes');
    };

    // Filter, search, and sort
    const filteredAndSortedUsers = users
        .filter(u => {
            const matchesSearch = u.email.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesRole = filterRole === 'all' || u.role === filterRole;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'points') {
                aVal = a.gamification?.points || 0;
                bVal = b.gamification?.points || 0;
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

    // Pagination logic
    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // Quiz form handlers (continued from original)
    const addQuestion = () => {
        setQuizForm({
            ...quizForm,
            questions: [
                ...quizForm.questions,
                {
                    text: '',
                    options: [
                        { id: 1, text: '', is_correct: false },
                        { id: 2, text: '', is_correct: false },
                        { id: 3, text: '', is_correct: false },
                        { id: 4, text: '', is_correct: false }
                    ],
                    explanation: ''
                }
            ]
        });
    };

    const removeQuestion = (index) => {
        if (quizForm.questions.length === 1) {
            showToast('Quiz must have at least one question', 'warning');
            return;
        }
        setQuizForm({
            ...quizForm,
            questions: quizForm.questions.filter((_, i) => i !== index)
        });
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...quizForm.questions];
        updatedQuestions[index][field] = value;
        setQuizForm({ ...quizForm, questions: updatedQuestions });
    };

    const updateOption = (questionIndex, optionIndex, field, value) => {
        const updatedQuestions = [...quizForm.questions];
        updatedQuestions[questionIndex].options[optionIndex][field] = value;
        setQuizForm({ ...quizForm, questions: updatedQuestions });
    };

    const validateQuizForm = () => {
        if (!quizForm.title || quizForm.title.length < 3) {
            showToast('Quiz title must be at least 3 characters', 'error');
            return false;
        }
        if (!quizForm.description) {
            showToast('Quiz description is required', 'error');
            return false;
        }
        if (quizForm.questions.length === 0) {
            showToast('Quiz must have at least one question', 'error');
            return false;
        }

        for (let i = 0; i < quizForm.questions.length; i++) {
            const q = quizForm.questions[i];
            if (!q.text) {
                showToast(`Question ${i + 1} text is required`, 'error');
                return false;
            }
            const hasCorrectAnswer = q.options.some(opt => opt.is_correct);
            if (!hasCorrectAnswer) {
                showToast(`Question ${i + 1} must have at least one correct answer`, 'error');
                return false;
            }
            const emptyOption = q.options.find(opt => !opt.text);
            if (emptyOption) {
                showToast(`Question ${i + 1} has empty option(s)`, 'error');
                return false;
            }
        }
        return true;
    };

    const handleCreateQuiz = async () => {
        if (!validateQuizForm()) return;

        showConfirm(
            'Create Quiz',
            `Create quiz "${quizForm.title}" with ${quizForm.questions.length} question(s)?`,
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.post('/api/admin/quizzes', quizForm, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setShowQuizForm(false);
                    setQuizForm({
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
                    fetchData();
                    showToast('Quiz created successfully', 'success');
                } catch (error) {
                    console.error('Error creating quiz:', error);
                    showToast('Failed to create quiz', 'error');
                } finally {
                    closeConfirm();
                }
            },
            'info'
        );
    };

    // Show access denied if not admin
    if (user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the admin panel.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Only administrators can view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Toast Notification */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={closeConfirm}
                type={confirmDialog.type}
            />

            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage users, quizzes, and view analytics</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'users', label: 'User Management', icon: Users },
                        { id: 'quizzes', label: 'Quiz Management', icon: BookOpen },
                        { id: 'analytics', label: 'Analytics', icon: Award }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setCurrentPage(1);
                                setSelectedUsers([]);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium focus-visible-custom ${activeTab === tab.id
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
                    </div>
                ) : (
                    <>
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white">
                                    <Users className="mb-2" size={32} />
                                    <h3 className="text-2xl font-bold">{analytics.totalUsers || 0}</h3>
                                    <p className="text-purple-100">Total Users</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white">
                                    <BookOpen className="mb-2" size={32} />
                                    <h3 className="text-2xl font-bold">{analytics.totalQuizzes || 0}</h3>
                                    <p className="text-blue-100">Total Quizzes</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 text-white">
                                    <TrendingUp className="mb-2" size={32} />
                                    <h3 className="text-2xl font-bold">{analytics.activeUsers || 0}</h3>
                                    <p className="text-green-100">Active Learners</p>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg p-6 text-white">
                                    <Award className="mb-2" size={32} />
                                    <h3 className="text-2xl font-bold">{analytics.totalPoints || 0}</h3>
                                    <p className="text-yellow-100">Total Points</p>
                                </div>
                            </div>
                        )}

                        {/* User Management Tab */}
                        {activeTab === 'users' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>

                                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                                        {/* Search */}
                                        <div className="relative flex-1 lg:flex-initial">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full lg:w-64"
                                            />
                                        </div>

                                        {/* Role Filter */}
                                        <select
                                            value={filterRole}
                                            onChange={(e) => {
                                                setFilterRole(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="student">Students</option>
                                            <option value="admin">Admins</option>
                                            <option value="teacher">Teachers</option>
                                        </select>

                                        {/* Export Button */}
                                        <button
                                            onClick={exportUsers}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors"
                                        >
                                            <Download size={18} />
                                            <span className="hidden sm:inline">Export CSV</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Bulk Operations */}
                                {selectedUsers.length > 0 && (
                                    <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex flex-wrap items-center gap-3">
                                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                            {selectedUsers.length} user(s) selected
                                        </span>
                                        <select
                                            value={bulkRole}
                                            onChange={(e) => setBulkRole(e.target.value)}
                                            className="px-3 py-1 border border-purple-300 dark:border-purple-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                            <option value="teacher">Teacher</option>
                                        </select>
                                        <button
                                            onClick={handleBulkRoleUpdate}
                                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                                        >
                                            Update Selected Roles
                                        </button>
                                        <button
                                            onClick={() => setSelectedUsers([])}
                                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
                                        >
                                            Clear Selection
                                        </button>
                                    </div>
                                )}

                                {/* User Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left">
                                                    <button
                                                        onClick={toggleSelectAll}
                                                        className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                                    >
                                                        {selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0 ? (
                                                            <CheckSquare size={18} />
                                                        ) : (
                                                            <Square size={18} />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    <button
                                                        onClick={() => {
                                                            setSortBy('email');
                                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                        }}
                                                        className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400"
                                                    >
                                                        Email
                                                        {sortBy === 'email' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                                    </button>
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    <button
                                                        onClick={() => {
                                                            setSortBy('role');
                                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                        }}
                                                        className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400"
                                                    >
                                                        Role
                                                        {sortBy === 'role' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                                    </button>
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    <button
                                                        onClick={() => {
                                                            setSortBy('points');
                                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                        }}
                                                        className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400"
                                                    >
                                                        Points
                                                        {sortBy === 'points' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                                    </button>
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Badges</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {paginatedUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => toggleUserSelection(u.id)}
                                                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                                        >
                                                            {selectedUsers.includes(u.id) ? (
                                                                <CheckSquare size={18} />
                                                            ) : (
                                                                <Square size={18} />
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{u.email}</td>
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="teacher">Teacher</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                        {u.gamification?.points || 0}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                        {u.gamification?.badges?.length || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                                            <Edit size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {filteredAndSortedUsers.length > 0 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        itemsPerPage={itemsPerPage}
                                        totalItems={filteredAndSortedUsers.length}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                    />
                                )}

                                {filteredAndSortedUsers.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No users found matching your criteria.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quiz Management Tab */}
                        {activeTab === 'quizzes' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Management</h2>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={exportQuizzes}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors"
                                        >
                                            <Download size={18} />
                                            Export CSV
                                        </button>
                                        <button
                                            onClick={() => setShowQuizForm(!showQuizForm)}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors"
                                        >
                                            <Plus size={18} />
                                            Create Quiz
                                        </button>
                                    </div>
                                </div>

                                {/* Quiz Form */}
                                {showQuizForm && (
                                    <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Quiz</h3>
                                            <button
                                                onClick={() => setShowQuizForm(false)}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Quiz Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={quizForm.title}
                                                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    placeholder="Enter quiz title"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Description <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={quizForm.description}
                                                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    rows="3"
                                                    placeholder="Enter quiz description"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Time Limit (seconds)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={quizForm.time_limit}
                                                        onChange={(e) => setQuizForm({ ...quizForm, time_limit: parseInt(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Points Reward
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={quizForm.points_reward}
                                                        onChange={(e) => setQuizForm({ ...quizForm, points_reward: parseInt(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Questions */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">Questions</h4>
                                                    <button
                                                        onClick={addQuestion}
                                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                        Add Question
                                                    </button>
                                                </div>

                                                {quizForm.questions.map((question, qIndex) => (
                                                    <div key={qIndex} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h5 className="font-medium text-gray-900 dark:text-white">Question {qIndex + 1}</h5>
                                                            {quizForm.questions.length > 1 && (
                                                                <button
                                                                    onClick={() => removeQuestion(qIndex)}
                                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <input
                                                            type="text"
                                                            value={question.text}
                                                            onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                                            className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                            placeholder="Enter question text"
                                                        />

                                                        <div className="space-y-2">
                                                            {question.options.map((option, oIndex) => (
                                                                <div key={oIndex} className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={option.is_correct}
                                                                        onChange={(e) => updateOption(qIndex, oIndex, 'is_correct', e.target.checked)}
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={option.text}
                                                                        onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                        placeholder={`Option ${oIndex + 1}`}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <input
                                                            type="text"
                                                            value={question.explanation}
                                                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                                            className="w-full px-3 py-2 mt-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                            placeholder="Explanation (optional)"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleCreateQuiz}
                                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                                >
                                                    <Save size={18} />
                                                    Create Quiz
                                                </button>
                                                <button
                                                    onClick={() => setShowQuizForm(false)}
                                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Quiz List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {quizzes.map(quiz => (
                                        <div key={quiz.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{quiz.description}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                <span>{quiz.questions?.length || 0} questions</span>
                                                <span>{quiz.points || quiz.points_reward || 0} points</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {quizzes.length === 0 && !showQuizForm && (
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        No quizzes found. Create your first quiz!
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Platform Analytics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">User Engagement</h3>
                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                            {analytics.activeUsers || 0} / {analytics.totalUsers || 0}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active users with points</p>
                                    </div>
                                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Average Points</h3>
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {analytics.totalUsers > 0
                                                ? Math.round((analytics.totalPoints || 0) / analytics.totalUsers)
                                                : 0}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Per user</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes scale-in {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
                
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
