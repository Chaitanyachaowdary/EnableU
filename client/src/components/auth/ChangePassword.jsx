import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldAlert, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { useApi } from '../../hooks/useApi';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ThreeDElement from '../common/ThreeDElement';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const { request, loading, error } = useApi();
    const navigate = useNavigate();
    const { reduceMotion, highContrast } = useAccessibility();

    const { ref: cardRef, style: cardStyle, onMouseMove, onMouseLeave } = useTilt(10);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return;

        try {
            await request('post', '/auth/change-password', { currentPassword, newPassword });
            setSuccess(true);

            // Update local user data - clear the flag
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            storedUser.requires_password_change = false;
            localStorage.setItem('user', JSON.stringify(storedUser));

            setTimeout(() => {
                const role = storedUser.role;
                navigate(role === 'admin' ? '/admin' : '/');
            }, 2000);
        } catch (err) {
            console.error('Password change failed', err);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
                <div className="max-w-md w-full text-center space-y-6 animate-fade-in-3d">
                    <div className="inline-flex p-6 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle2 size={64} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900">Security Updated!</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Your password has been changed successfully. Taking you to your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-slate-100">
            {!reduceMotion && !highContrast && (
                <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
                    <ThreeDElement type="sphere" size={300} className="absolute -top-40 -left-40" />
                    <ThreeDElement type="cube" size={100} className="absolute bottom-20 right-20" />
                </div>
            )}

            <div className="relative w-full max-w-md z-10 animate-fade-in-3d">
                <div className="text-center mb-10 depth-layer-2">
                    <div className="inline-flex p-4 mb-6 rounded-3xl bg-indigo-600 text-white shadow-2xl">
                        <ShieldAlert size={40} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
                        Security Update Required
                    </h1>
                    <p className="text-gray-500 font-medium tracking-tight">
                        Please update your password to continue.
                    </p>
                </div>

                <div
                    ref={cardRef}
                    style={cardStyle}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    className="glass-effect p-8 rounded-3xl shadow-2xl relative preserve-3d"
                >
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                                <AlertCircle size={18} />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Current Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700 ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="mt-3 p-3 bg-white/40 rounded-xl border border-white/60">
                                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Password Requirements</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {newPassword.length >= 8 ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>8+ Characters</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[A-Z]/.test(newPassword) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Uppercase Letter</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[a-z]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[a-z]/.test(newPassword) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Lowercase Letter</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[0-9]/.test(newPassword) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Number</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(newPassword) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Special Character</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword || newPassword !== confirmPassword}
                            className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
                        >
                            Update & Continue
                            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div> : <ArrowRight size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ChangePassword;
