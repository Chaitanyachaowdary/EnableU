import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ForcePasswordChangeModal from '../ForcePasswordChangeModal';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

    // Initialize user and security check on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setRequiresPasswordChange(parsedUser.requires_password_change || false);
        } else {
            // Safety fallback if accessed without auth (though ProtectedRoute handles this)
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handlePasswordChanged = () => {
        setRequiresPasswordChange(false);
        // Update local storage to reflect change
        const updatedUser = { ...user, requires_password_change: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        // Force refresh to ensure all states are clean? Or just seamless update
        // Seamless is better UX
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
            {/* Security Modal - Blocks Interaction if Active */}
            {requiresPasswordChange && (
                <ForcePasswordChangeModal
                    user={user}
                    onPasswordChanged={handlePasswordChanged}
                />
            )}

            {/* Sidebar Navigation */}
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header
                    user={user}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onLogout={handleLogout}
                />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 relative scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
