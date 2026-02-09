import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { useAuth } from './contexts/AuthContext';

// Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';

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
import AdminDashboard from './components/admin/AdminDashboard';


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

function App() {
  return (
    <AccessibilityProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
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
      </Routes>
    </AccessibilityProvider>
  );
}

export default App;
