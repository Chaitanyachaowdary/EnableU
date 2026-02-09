import React, { useState } from 'react';
import { Layout, List, Users, Activity, Menu, X, User, BookOpen, Shield, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-75 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Content */}
            <div className={`
                fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out z-30 md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
                        <Users className="text-indigo-600 dark:text-indigo-400" />
                        <span>Enable U</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-gray-100 md:hidden focus-visible-custom"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <nav className="mt-6 flex flex-col gap-1 px-4">
                    <Link
                        to="/"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-visible-custom ${location.pathname === '/'
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Layout size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/quizzes"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-visible-custom ${location.pathname.startsWith('/quizzes')
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <BookOpen size={20} />
                        <span>Learning Modules</span>
                    </Link>
                    <Link
                        to="/progress"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-visible-custom ${location.pathname === '/progress'
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Activity size={20} />
                        <span>Progress</span>
                    </Link>
                    <Link
                        to="/profile"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-visible-custom ${location.pathname === '/profile'
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </Link>


                    {user && user.role === 'admin' && (
                        <Link
                            to="/admin"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-visible-custom ${location.pathname === '/admin'
                                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Shield size={20} />
                            <span>Admin Panel</span>
                        </Link>
                    )}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 w-full transition-colors focus-visible-custom rounded-lg"
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
