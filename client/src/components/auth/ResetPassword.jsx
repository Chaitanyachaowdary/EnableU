import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { useApi } from '../../hooks/useApi';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ThreeDElement from '../common/ThreeDElement';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const { request, loading, error } = useApi();
    const navigate = useNavigate();
    const { reduceMotion, highContrast } = useAccessibility();

    const { ref: cardRef, style: cardStyle, onMouseMove, onMouseLeave } = useTilt(10);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return;
        }

        try {
            await request('post', '/auth/reset-password', { token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error('Reset failed', err);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen flex items-center justify-center p-8 bg-slate-50 overflow-hidden">
                <div className="max-w-md w-full text-center space-y-6 animate-fade-in-3d">
                    <div className="inline-flex p-6 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle2 size={64} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900">Success!</h1>
                    <p className="text-gray-500 font-medium">Your password has been reset. Redirecting to login...</p>
                    <Link to="/login" className="inline-block text-indigo-600 font-bold hover:underline">
                        Click here if not redirected
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-slate-50">
            {!reduceMotion && !highContrast && (
                <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                    <ThreeDElement type="pyramid" size={200} className="absolute -top-20 -right-20" />
                    <ThreeDElement type="ring" size={150} className="absolute -bottom-20 -left-20" />
                </div>
            )}

            <div className="relative w-full max-w-md z-10 animate-fade-in-3d">
                <div className="text-center mb-10 depth-layer-2 animate-slide-up-fade opacity-100">
                    <div className="inline-flex p-4 mb-6 rounded-3xl bg-indigo-600 text-white shadow-2xl">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
                        Set New Password
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Choose a strong password to secure your account.
                    </p>
                </div>

                <div
                    ref={cardRef}
                    style={cardStyle}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    className="glass-effect p-8 rounded-3xl shadow-2xl relative preserve-3d"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl animate-shake">
                                <AlertCircle size={18} />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 ml-1">
                                New Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 ml-1">
                                Confirm New Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1 font-medium ml-1">Passwords do not match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword || newPassword !== confirmPassword}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Reset Password'}
                            <Send size={18} />
                        </button>

                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors pt-2"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </Link>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;
