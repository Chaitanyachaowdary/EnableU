import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { useAuth } from './contexts/AuthContext';

// Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';

import ResetPassword from './components/auth/ResetPassword';
import ChangePassword from './components/auth/ChangePassword';

// User Components
import Dashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';
import ProgressDashboard from './components/user/ProgressDashboard';

// Layout Components
import Layout from './components/layout/Layout';

// Quiz Components
import QuizList from './components/quiz/QuizList';
import QuizPlayer from './components/quiz/QuizPlayer';

// Admin Components
import AdminLayout from './components/admin/layout/AdminLayout';
import DashboardOverview from './components/admin/pages/DashboardOverview';
import UserManagement from './components/admin/pages/UserManagement';
import QuizManagement from './components/admin/pages/QuizManagement';
import Analytics from './components/admin/pages/Analytics';




const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

import ReadingGuide from './components/common/ReadingGuide';
import AccessibilityMenu from './components/common/AccessibilityMenu';

// ...

function App() {
  return (
    <AccessibilityProvider>
      <ReadingGuide />
      <AccessibilityMenu />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <PrivateRoute>
                <QuizList />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizzes/:id"
            element={
              <PrivateRoute>
                <QuizPlayer />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <ProgressDashboard />
              </PrivateRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="quizzes" element={<QuizManagement />} />
          <Route path="analytics" element={<Analytics />} />

        </Route>
      </Routes>
    </AccessibilityProvider>
  );
}

export default App;
