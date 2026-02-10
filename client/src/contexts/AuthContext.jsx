import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../services/api.service';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Session timeout configurations (in milliseconds)
    const SESSION_TIMEOUT = {
        admin: 30 * 60 * 1000,      // 30 minutes for admins
        teacher: 2 * 60 * 60 * 1000, // 2 hours for teachers
        student: 24 * 60 * 60 * 1000 // 24 hours for students
    };

    const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes warning

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const loginTime = localStorage.getItem('loginTime');

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.role) {
                    const loginTime = localStorage.getItem('loginTime');
                    if (loginTime) {
                        const timeElapsed = Date.now() - parseInt(loginTime);
                        const timeout = SESSION_TIMEOUT[parsedUser.role] || SESSION_TIMEOUT.student;

                        if (timeElapsed < timeout) {
                            setUser(parsedUser);
                        } else {
                            logout('Session expired. Please login again.');
                        }
                    } else {
                        // Migration path for users without loginTime
                        setUser(parsedUser);
                        localStorage.setItem('loginTime', Date.now().toString());
                    }
                }
            } catch (e) {
                console.error('Failed to parse stored user', e);
                logout();
            }
        }
        setLoading(false);
    }, []);

    // Session timeout checker
    useEffect(() => {
        if (!user) return;

        const timeout = SESSION_TIMEOUT[user.role] || SESSION_TIMEOUT.student;
        const loginTime = parseInt(localStorage.getItem('loginTime'));
        const timeElapsed = Date.now() - loginTime;
        const remainingTime = timeout - timeElapsed;

        // Set timeout to logout when session expires
        const logoutTimer = setTimeout(() => {
            logout('Your session has expired. Please login again.');
        }, remainingTime);

        // Set warning timer (5 minutes before logout)
        const warningTime = remainingTime - WARNING_BEFORE_TIMEOUT;
        let warningTimer;

        if (warningTime > 0) {
            warningTimer = setTimeout(() => {
                if (confirm('Your session will expire in 5 minutes. Click OK to extend your session.')) {
                    extendSession();
                }
            }, warningTime);
        }

        return () => {
            clearTimeout(logoutTimer);
            if (warningTimer) clearTimeout(warningTimer);
        };
    }, [user]);


    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            // api.service.js interceptor returns response, so we access .data
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('loginTime', Date.now().toString());

            setUser(userData);

            // Log admin login
            if (userData.role === 'admin') {
                logActivity('LOGIN', 'Admin logged in');
            }

            return { success: true, user: userData };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = useCallback((message = null) => {
        if (user?.role === 'admin') {
            logActivity('LOGOUT', 'Admin logged out');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        setUser(null);

        // Use window.location instead of navigate to avoid Router dependency
        window.location.href = '/login';

        if (message) {
            // Show message to user
            localStorage.setItem('logoutMessage', message);
        }
    }, [user]);

    const extendSession = () => {
        // Reset login time to extend session
        localStorage.setItem('loginTime', Date.now().toString());

        if (user?.role === 'admin') {
            logActivity('SESSION_EXTENDED', 'Admin extended session');
        }
    };

    const logActivity = async (action, details) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/audit-log', {
                action,
                details,
                timestamp: new Date().toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        extendSession,
        logActivity,
        sessionTimeout: user ? SESSION_TIMEOUT[user.role] : null,
        isAdmin: user?.role === 'admin',
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
