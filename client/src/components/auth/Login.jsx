import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ThreeDElement from '../common/ThreeDElement';

/**
 * Senior Best Practice: Immersive Authentication
 * Combines high-end 3D aesthetics with robust security logic.
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Use centralized Auth Context
    const { login, loading } = useAuth();
    const [error, setError] = useState('');

    const { reduceMotion, highContrast } = useAccessibility();

    // Parallax logic for immersive depth
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMoveGlobal = (e) => {
        if (reduceMotion || highContrast) return;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setMousePos({ x: (e.clientX - centerX) / 40, y: (e.clientY - centerY) / 40 });
    };

    const { ref: cardRef, style: cardStyle, onMouseMove, onMouseLeave } = useTilt(10);

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            // Clear message from history
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const result = await login(email, password);

        if (result.success) {
            // Check for mandatory security updates
            if (result.user.requires_password_change) {
                navigate('/change-password');
                return;
            }

            // Standard role-based redirection
            navigate(result.user.role === 'admin' ? '/admin' : '/');
        } else {
            setError(result.error);
        }
    };

    return (
        <main
            onMouseMove={handleMouseMoveGlobal}
            className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-slate-50 perspective-container"
            role="main"
        >
            {/* Global Immersive 3D Elements */}
            {!reduceMotion && !highContrast && (
                <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                    <ThreeDElement type="cube" size={150} className="absolute -top-10 -left-10" style={{ transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * -1}px, 0)` }} />
                    <ThreeDElement type="pyramid" size={80} className="absolute top-1/4 -right-10" style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }} />
                    <ThreeDElement type="ring" size={120} className="absolute -bottom-20 left-1/4" style={{ transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)` }} />
                    <ThreeDElement type="sphere" size={60} className="absolute bottom-1/4 right-1/4" style={{ transform: `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0)` }} />
                </div>
            )}

            <div className="relative w-full max-w-md z-10 animate-fade-in-3d">
                <div className="text-center mb-10 depth-layer-2">
                    <div className="inline-flex p-4 mb-6 rounded-3xl bg-indigo-600 text-white shadow-2xl transform-gpu hover:scale-110 transition-transform">
                        <Lock size={40} />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-2">Enable U</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Security-First Learning Identity</p>
                </div>

                <div
                    ref={cardRef}
                    style={cardStyle}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    className="glass-effect p-8 rounded-3xl shadow-2xl relative preserve-3d transition-transform duration-200 premium-tilt"
                >
                    <form className="space-y-6 preserve-3d" onSubmit={handleSubmit}>
                        {message && (
                            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 text-indigo-700 p-4 rounded-xl depth-layer-2 animate-slide-up-fade">
                                <ShieldCheck size={18} />
                                <p className="text-sm font-bold">{message}</p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl depth-layer-2 animate-slide-up-fade">
                                <AlertCircle size={18} />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2 depth-layer-3">
                            <label className="block text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 depth-layer-3">
                            <div className="flex justify-between items-center ml-1">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Password</label>
                                <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 depth-layer-2"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                            {!loading && <LogIn size={18} />}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-4 depth-layer-1">
                        <Link to="/signup" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                            Need an account? Sign up <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div >
        </main >
    );
};

export default Login;
