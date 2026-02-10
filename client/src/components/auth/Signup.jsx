import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import { useApi } from '../../hooks/useApi';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ThreeDElement from '../common/ThreeDElement';

/**
 * Senior Best Practice: Immersive Onboarding
 * Extends the 3D design language to the signup experience.
 */
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { request, loading, error } = useApi();
    const { reduceMotion, highContrast } = useAccessibility();

    // Parallax logic for brand consistency
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMoveGlobal = (e) => {
        if (reduceMotion || highContrast) return;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setMousePos({ x: (e.clientX - centerX) / 40, y: (e.clientY - centerY) / 40 });
    };

    const { ref: cardRef, style: cardStyle, onMouseMove, onMouseLeave } = useTilt(10);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await request('post', '/auth/register', { email, password });
            navigate('/login', { state: { message: 'Registration successful. Welcome to the future of learning!' } });
        } catch (err) {
            console.error('Registration failed', err);
        }
    };

    return (
        <main
            onMouseMove={handleMouseMoveGlobal}
            className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-indigo-50/30 perspective-container"
            role="main"
        >
            {/* Immersive 3D Background with Parallax */}
            {!reduceMotion && !highContrast && (
                <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                    <ThreeDElement type="pyramid" size={140} className="absolute -top-10 -right-10" style={{ transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * -1}px, 0)` }} />
                    <ThreeDElement type="ring" size={70} className="absolute top-1/3 -left-10" style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }} />
                    <ThreeDElement type="sphere" size={110} className="absolute -bottom-20 right-1/4" style={{ transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)` }} />
                </div>
            )}

            <div className="relative w-full max-w-md animate-fade-in-3d preserve-3d z-10">
                <div className="text-center mb-10 depth-layer-2">
                    <div className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-indigo-600 text-white shadow-2xl transform-gpu hover:scale-110 transition-transform">
                        <UserPlus size={40} />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-2">Join EnableU</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Begin your immersive learning journey</p>
                </div>

                <div
                    ref={cardRef}
                    style={cardStyle}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    className="glass-effect p-8 rounded-3xl shadow-2xl relative preserve-3d transition-transform duration-200 premium-tilt"
                >
                    <form className="space-y-6 preserve-3d" onSubmit={handleSubmit}>
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
                            <label className="block text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Password</label>
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

                            {/* Password Strength Indicator */}
                            <div className="mt-3 p-3 bg-white/40 rounded-xl border border-white/60">
                                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Password Requirements</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className={`flex items-center gap-1.5 ${password.length >= 8 ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {password.length >= 8 ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>8+ Characters</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[A-Z]/.test(password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Uppercase Letter</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[a-z]/.test(password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Lowercase Letter</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[0-9]/.test(password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Number</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(password) ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                                        {/[!@#$%^&*(),.?":{}|<>\-_+=/[\]';]/.test(password) ? <ShieldCheck size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />}
                                        <span>Special Character</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl hover:bg-indigo-700 transform hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 depth-layer-2"
                        >
                            {loading ? 'Creating Profile...' : 'Create Account'}
                            {!loading && <UserPlus size={18} />}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-4 depth-layer-1">
                        <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                            Already have an account? Sign in <LogIn size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Signup;
