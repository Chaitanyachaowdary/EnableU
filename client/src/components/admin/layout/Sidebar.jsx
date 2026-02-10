import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, BarChart2, Shield, X, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
        { path: '/admin/quizzes', icon: BookOpen, label: 'Quiz Management' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    ];



    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 flex flex-col h-screen
            `}>
                {/* Logo Area */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Shield className="w-8 h-8 text-indigo-500" />
                        <span>Enable<span className="text-indigo-500">U</span></span>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                            `}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / User Info could go here */}
                <div className="p-4 border-t border-gray-800">
                    <div className="text-xs text-gray-500 text-center">
                        &copy; 2026 Admin Portal
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
