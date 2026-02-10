import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, Download, Users, Edit, Square, CheckSquare,
    ChevronUp, ChevronDown, UserPlus, X, Mail, Lock, User as UserIcon, Shield, ShieldCheck
} from 'lucide-react';
import Toast from '../../common/Toast';
import ConfirmDialog from '../../common/ConfirmDialog';
import Pagination from '../../common/Pagination';
import { useApi } from '../../../hooks/useApi';
import { useAccessibility } from '../../../contexts/AccessibilityContext';
import { useTilt } from '../../../hooks/useTilt';
import { SkeletonLeaderboard } from '../../common/SkeletonLoaders';

const UserManagement = () => {
    const { request, loading, error } = useApi();
    const [users, setUsers] = useState([]);
    const { request: createReq, loading: createLoading } = useApi();
    const { request: updateReq } = useApi();
    const { reduceMotion, highContrast } = useAccessibility();
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const { ref: containerRef, style: containerStyle, onMouseMove, onMouseLeave } = useTilt(2);

    // State variables for filtering, sorting, and pagination
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [bulkRole, setBulkRole] = useState('student');

    // Create & Edit State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ email: '', name: '', password: '', role: 'student' });
    const [editUserForm, setEditUserForm] = useState({ id: '', email: '', name: '', password: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await request('get', '/admin/users');
                setUsers(data);
            } catch (err) {
                console.error('Failed to load users', err);
            }
        };
        fetchUsers();
    }, [request]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const data = await createReq('post', '/admin/users', newUserForm);
            setUsers([data.user, ...users]);
            setToast({ message: 'User created successfully', type: 'success' });
            setIsCreateModalOpen(false);
            setNewUserForm({ email: '', name: '', password: '', role: 'student' });
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Failed to create user', type: 'error' });
        }
    };

    const openEditModal = (user) => {
        setEditUserForm({
            id: user.id,
            email: user.email,
            name: user.name || '',
            password: '' // Don't pre-fill password
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                email: editUserForm.email,
                name: editUserForm.name
            };
            if (editUserForm.password) {
                payload.password = editUserForm.password;
            }

            const response = await updateReq('put', `/admin/users/${editUserForm.id}`, payload);

            setUsers(users.map(u => u.id === editUserForm.id ? { ...u, ...response.user } : u));
            setToast({ message: 'User updated successfully', type: 'success' });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
            setToast({ message: error.response?.data?.message || 'Failed to update user', type: 'error' });
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateReq('put', `/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setToast({ message: `User role updated to ${newRole}`, type: 'success' });
        } catch (error) {
            console.error('Error updating role:', error);
            setToast({ message: 'Failed to update user role', type: 'error' });
        }
    };

    const handleBulkRoleUpdate = () => {
        if (selectedUsers.length === 0) {
            setToast({ message: 'Please select users first', type: 'warning' });
            return;
        }

        setConfirmDialog({
            isOpen: true,
            title: 'Bulk Role Update',
            message: `Are you sure you want to update ${selectedUsers.length} user(s) to ${bulkRole} role?`,
            type: 'warning',
            onConfirm: async () => {
                try {
                    await Promise.all(
                        selectedUsers.map(userId =>
                            updateReq('put', `/admin/users/${userId}/role`, { role: bulkRole })
                        )
                    );
                    setUsers(users.map(u =>
                        selectedUsers.includes(u.id) ? { ...u, role: bulkRole } : u
                    ));
                    setSelectedUsers([]);
                    setToast({ message: `Updated ${selectedUsers.length} users successfully`, type: 'success' });
                } catch (error) {
                    console.error('Error bulk updating roles:', error);
                    setToast({ message: 'Failed to update user roles', type: 'error' });
                } finally {
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const exportUsers = () => {
        if (!users || users.length === 0) {
            setToast({ message: 'No data to export', type: 'warning' });
            return;
        }

        const headers = ['Email', 'Role', 'Points', 'Badges', 'Joined'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [
                u.email,
                u.role,
                u.gamification?.points || 0,
                u.gamification?.badges?.length || 0,
                new Date(u.created_at || '').toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        setToast({ message: 'Data exported successfully', type: 'success' });
    };

    const filteredAndSortedUsers = users
        .filter(u => {
            const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
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

    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    if (loading) {
        return <SkeletonLeaderboard />;
    }

    return (
        <div
            ref={containerRef}
            style={containerStyle}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="glass-effect rounded-[2.5rem] shadow-2xl border-white/20 p-8 md:p-12 preserve-3d animate-fade-in-3d"
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                type={confirmDialog.type}
            />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 depth-layer-2 animate-slide-up-fade opacity-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg">
                        <Users size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h2>
                        <p className="text-gray-500 font-medium tracking-tight">Manage user access and permissions at scale.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full lg:w-64 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

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

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                        <UserPlus size={18} />
                        <span className="hidden sm:inline">Add User</span>
                    </button>

                    <button
                        onClick={exportUsers}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Bulk Operations */}
            {selectedUsers.length > 0 && (
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex flex-wrap items-center gap-4 border border-indigo-100 dark:border-indigo-800 animate-fade-in">
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                        {selectedUsers.length} user(s) selected
                    </span>
                    <div className="flex items-center gap-2">
                        <select
                            value={bulkRole}
                            onChange={(e) => setBulkRole(e.target.value)}
                            className="px-3 py-1.5 border border-indigo-200 dark:border-indigo-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                        </select>
                        <button
                            onClick={handleBulkRoleUpdate}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                        >
                            Update Roles
                        </button>
                        <button
                            onClick={() => setSelectedUsers([])}
                            className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* User Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-4">
                                <button
                                    onClick={toggleSelectAll}
                                    className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    {selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0 ? (
                                        <CheckSquare size={20} className="text-indigo-600" />
                                    ) : (
                                        <Square size={20} />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                                <button
                                    onClick={() => {
                                        setSortBy('email');
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    }}
                                    className="flex items-center gap-2 hover:text-indigo-600"
                                >
                                    User info
                                    {sortBy === 'email' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">Role</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                                <button
                                    onClick={() => {
                                        setSortBy('points');
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    }}
                                    className="flex items-center gap-2 hover:text-indigo-600"
                                >
                                    Points
                                    {sortBy === 'points' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Badges</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {paginatedUsers.map(u => (
                            <tr key={u.id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors ${selectedUsers.includes(u.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleUserSelection(u.id)}
                                        className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {selectedUsers.includes(u.id) ? (
                                            <CheckSquare size={20} className="text-indigo-600" />
                                        ) : (
                                            <Square size={20} />
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{u.email}</span>
                                        <span className="text-xs text-gray-500 capitalize">{u.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                        {u.gamification?.points || 0} pts
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {u.gamification?.badges?.length || 0}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openEditModal(u)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredAndSortedUsers.length > 0 ? (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredAndSortedUsers.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(val) => {
                        setItemsPerPage(val);
                        setCurrentPage(1);
                    }}
                />
            ) : (
                <div className="text-center py-12 text-gray-500">
                    No users found matching your criteria.
                </div>
            )}
            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={newUserForm.name}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={newUserForm.email}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="user@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={newUserForm.password}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Password Requirements</p>
                                    <div className="grid grid-cols-1 gap-1 text-xs">
                                        <div className={`flex items-center gap-1.5 ${newUserForm.password.length >= 8 ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                            {newUserForm.password.length >= 8 ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                            <span>8+ Characters</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                            {/[A-Z]/.test(newUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                            <span>Uppercase Letter</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${/[a-z]/.test(newUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                            {/[a-z]/.test(newUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                            <span>Lowercase Letter</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${/[0-9]/.test(newUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                            {/[0-9]/.test(newUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                            <span>Number</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(newUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                            {/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(newUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                            <span>Special Character</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignment Role</label>
                                <select
                                    value={newUserForm.role}
                                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {createLoading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit User</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={editUserForm.name}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={editUserForm.email}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password (Optional)</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={editUserForm.password}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                                {editUserForm.password && (
                                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Password Requirements</p>
                                        <div className="grid grid-cols-1 gap-1 text-xs">
                                            <div className={`flex items-center gap-1.5 ${editUserForm.password.length >= 8 ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                                {editUserForm.password.length >= 8 ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                                <span>8+ Characters</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(editUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                                {/[A-Z]/.test(editUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                                <span>Uppercase Letter</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${/[a-z]/.test(editUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                                {/[a-z]/.test(editUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                                <span>Lowercase Letter</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${/[0-9]/.test(editUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                                {/[0-9]/.test(editUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                                <span>Number</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(editUserForm.password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                                {/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(editUserForm.password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                                <span>Special Character</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md active:scale-95"
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
