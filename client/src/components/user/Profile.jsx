import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useApi } from '../../hooks/useApi';
import { User, Mail, Lock, Save, Camera, Edit2, CheckCircle, XCircle } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const { request } = useApi();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Use global accessibility context
    const {
        highContrast, setHighContrast,
        reduceMotion, setReduceMotion,
        fontSize, setFontSize
    } = useAccessibility();

    // Form states
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || ''
    });

    // Password change state
    const [passwordMode, setPasswordMode] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Avatar state
    const [avatar, setAvatar] = useState(user.avatar || null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);

    // User stats
    const [stats, setStats] = useState({
        totalQuizzes: 0,
        totalPoints: 0,
        badges: 0,
        completionRate: 0
    });

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const data = await request('get', '/progress');
            setStats({
                totalQuizzes: data.totalQuizzes || 0,
                totalPoints: data.totalPoints || 0,
                badges: data.badges || 0,
                completionRate: data.completionRate || 0
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                showMessage('Image must be less than 2MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setAvatar(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const showMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
            const updatedUser = {
                ...user,
                name: formData.name,
                email: formData.email,
                avatar: avatarPreview,
                accessibilitySettings: { highContrast, reduceMotion, fontSize }
            };

            // Real API call
            await request('put', '/auth/me', {
                name: formData.name,
                email: formData.email,
                settings: updatedUser.accessibilitySettings
            });

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditMode(false);
            showMessage('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Update failed:', error);
            showMessage(error.response?.data?.message || 'Failed to update profile.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage('Password must be at least 6 characters.', 'error');
            return;
        }

        setLoading(true);
        try {
            await request('post', '/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordMode(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showMessage('Password changed successfully!', 'success');
        } catch (error) {
            console.error('Password change failed:', error);
            showMessage(error.response?.data?.message || 'Failed to change password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAccessibilitySave = () => {
        const updatedUser = {
            ...user,
            accessibilitySettings: { highContrast, reduceMotion, fontSize }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showMessage('Accessibility settings saved!', 'success');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account, accessibility preferences, and view your stats</p>
            </header>

            {/* Message Alert */}
            {message && (
                <div
                    className={`flex items-center gap-2 p-4 rounded-lg ${messageType === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        }`}
                    role="alert"
                    aria-live="polite"
                >
                    {messageType === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span>{message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Avatar Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile avatar"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-indigo-100 dark:border-indigo-900">
                                        {getInitials(user.name)}
                                    </div>
                                )}
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg focus-visible-custom"
                                    aria-label="Upload avatar"
                                >
                                    <Camera size={18} />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{user.name || 'User'}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <span className="mt-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
                                {user.role === 'admin' ? 'Administrator' : 'Student'}
                            </span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Learning Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Quizzes Taken</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.totalQuizzes}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Points</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.totalPoints}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.badges}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Completion</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.completionRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User size={20} />
                                Account Information
                            </h3>
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 focus-visible-custom"
                            >
                                <Edit2 size={16} />
                                {editMode ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!editMode}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!editMode}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white transition-colors"
                                />
                            </div>

                            {editMode && (
                                <button
                                    onClick={handleProfileUpdate}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 focus-visible-custom"
                                >
                                    <Save size={18} />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Password Change */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Lock size={20} />
                                Password & Security
                            </h3>
                            <button
                                onClick={() => setPasswordMode(!passwordMode)}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 focus-visible-custom"
                            >
                                {passwordMode ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>

                        {passwordMode ? (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        id="current-password"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <button
                                    onClick={handlePasswordChange}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors focus-visible-custom"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Keep your account secure by regularly updating your password.
                            </p>
                        )}
                    </div>

                    {/* Accessibility Preferences */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accessibility Preferences</h3>

                        <div className="space-y-6">
                            {/* Font Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Font Size: <span className="font-mono">{fontSize}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="100"
                                    max="200"
                                    step="10"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    aria-label="Adjust font size"
                                />
                            </div>

                            {/* High Contrast */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">High Contrast Mode</label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Improve text visibility</p>
                                </div>
                                <button
                                    onClick={() => setHighContrast(!highContrast)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible-custom ${highContrast ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    role="switch"
                                    aria-checked={highContrast}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Reduce Motion */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">Reduce Motion</label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Minimize animations</p>
                                </div>
                                <button
                                    onClick={() => setReduceMotion(!reduceMotion)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible-custom ${reduceMotion ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    role="switch"
                                    aria-checked={reduceMotion}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <button
                                onClick={handleAccessibilitySave}
                                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 focus-visible-custom"
                            >
                                <Save size={18} />
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
