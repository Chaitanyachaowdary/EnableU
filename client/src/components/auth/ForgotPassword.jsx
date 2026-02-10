import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { useApi } from '../../hooks/useApi';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ThreeDElement from '../common/ThreeDElement';

/**
 * Senior Best Practice: Immersive Authentication Flow
 * Extends the 3D design system to the password recovery process.
 */
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { request, loading, error } = useApi();
    const { reduceMotion, highContrast } = useAccessibility();

    // Parallax logic for consistency across Auth
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMoveGlobal = (e) => {
        if (reduceMotion || highContrast) return;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setMousePos({ x: (e.clientX - centerX) / 30, y: (e.clientY - centerY) / 30 });
    };

    const { ref: cardRef, style: cardStyle, onMouseMove, onMouseLeave } = useTilt(10);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await request('post', '/auth/forgot-password', { email });
            setMessage(response.message || 'If that email exists, a reset link has been sent.');
        } catch (err) {
            console.error('Password reset request failed', err);
        }
    };

    return (
        <main
            onMouseMove={handleMouseMoveGlobal}
            className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-rose-50/20 perspective-container"
            role="main"
        >
            {/* Global Immersive 3D Background with Parallax */}
            {!reduceMotion && !highContrast && (
                <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                    <ThreeDElement type="ring" size={160} className="absolute -top-20 right-1/4" style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }} />
                    <ThreeDElement type="ring" size={90} className="absolute top-1/2 -left-10" style={{ transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * -1}px, 0)` }} />
                    <ThreeDElement type="ring" size={130} className="absolute bottom-10 right-10" style={{ transform: `translate3d(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px, 0)` }} />
                </div>
            )}

            <div className="relative w-full max-w-md animate-fade-in-3d preserve-3d z-10">
                <div className="text-center mb-10 depth-layer-2 animate-slide-up-fade opacity-100">
                    <div className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-indigo-600 text-white shadow-2xl transform-gpu hover:scale-110 transition-transform">
                        <Lock size={40} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-3">
                        Reset Password
                    </h1>
                    <p className="text-gray-500 font-medium px-8">
                        Enter your email and we'll send you a link to get back into your account.
                    </p>
                </div>

                <div
                    ref={cardRef}
                    style={cardStyle}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    className="glass-effect p-8 rounded-3xl shadow-2xl relative preserve-3d transition-transform duration-200 card-3d-shine premium-tilt"
                >
                    <form className="space-y-6 preserve-3d" onSubmit={handleSubmit} noValidate>
                        {message && (
                            <div role="status" className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl depth-layer-2 floating-3d">
                                <CheckCircle2 size={20} />
                                <p className="text-sm font-bold">{message}</p>
                            </div>
                        )}

                        {error && !message && (
                            <div role="alert" className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl depth-layer-2 animate-slide-up-fade floating-3d">
                                <AlertCircle size={20} />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2 depth-layer-3 animate-slide-up-fade delay-100">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium premium-input"
                                    aria-required="true"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-1 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/50 depth-layer-3 hover:shadow-indigo-500/40 animate-slide-up-fade delay-200
                                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center animate-slide-up-fade delay-300 depth-layer-1">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
