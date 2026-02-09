import React from 'react';
import { Menu, LogOut, Bell, User } from 'lucide-react';

const Header = ({ user, toggleSidebar, onLogout }) => {
    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 transition-colors duration-200">
            {/* Left: Mobile Toggle & Breadcrumbs (Placeholder) */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
                    Dashboard
                </h1>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Notification Bell (Mock) */}
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                {/* Profile Dropdown Area */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.email || 'Admin User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Administrator
                        </p>
                    </div>

                    <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm">
                        {user?.email ? user.email[0].toUpperCase() : <User className="w-5 h-5" />}
                    </div>

                    <button
                        onClick={onLogout}
                        className="ml-2 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
