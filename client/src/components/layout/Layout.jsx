import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from '../common/Footer';
import ThreeDElement from '../common/ThreeDElement';

import { Menu, Layout as LayoutIcon, Eye, X, ZoomIn, ZoomOut, Moon, Sun, Type, Activity } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (reduceMotion || highContrast) return;
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setMousePos({
            x: (clientX - centerX) / 50,
            y: (clientY - centerY) / 50
        });
    };
    const [isA11yMenuOpen, setIsA11yMenuOpen] = useState(false);

    const {
        fontSize, setFontSize,
        highContrast, setHighContrast,
        reduceMotion, setReduceMotion
    } = useAccessibility();

    // Enable global keyboard shortcuts
    useKeyboardShortcuts();

    return (
        <div
            onMouseMove={handleMouseMove}
            className={`flex h-screen overflow-hidden perspective-container ${highContrast ? 'bg-black text-white' : 'bg-slate-50'}`}
        >
            {/* Global Immersive 3D Background with Parallax */}
            {!reduceMotion && !highContrast && (
                <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                    <ThreeDElement type="sphere" size={200} className="absolute -top-20 -left-20" style={{ transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * -1}px, 0)` }} />
                    <ThreeDElement type="sphere" size={100} className="absolute top-1/4 -right-10" style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }} />
                    <ThreeDElement type="sphere" size={150} className="absolute -bottom-20 left-1/3" style={{ transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)` }} />
                    <ThreeDElement type="sphere" size={80} className="absolute bottom-1/4 right-1/4" style={{ transform: `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0)` }} />
                </div>
            )}

            <a href="#main-content" className="skip-link focus-visible-custom text-center">
                Skip to Main Content
            </a>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 relative z-10 ${highContrast ? 'bg-black' : ''}`}>
                {/* Mobile Header */}
                <header className={`md:hidden px-4 py-3 border-b flex items-center justify-between shadow-sm z-10 ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`p-2 rounded-lg focus-visible-custom ${highContrast ? 'text-white hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            aria-label="Open Sidebar"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg'}`}>
                                <LayoutIcon className="w-4 h-4" />
                            </div>
                            <span className={`font-bold ${highContrast ? 'text-white' : 'text-gray-900'}`}>EnableU</span>
                        </div>
                    </div>
                </header>

                <main id="main-content" className={`flex-1 overflow-y-auto relative ${highContrast ? 'bg-black text-white' : 'bg-transparent'}`} tabIndex="-1">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>

                    <Footer />

                    {/* Accessibility Floating Action Button */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            onClick={() => setIsA11yMenuOpen(!isA11yMenuOpen)}
                            className={`p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 focus-visible-custom ${highContrast ? 'bg-yellow-400 text-black border-4 border-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-300'}`}
                            aria-label="Accessibility Settings"
                            aria-expanded={isA11yMenuOpen}
                        >
                            <Eye size={24} />
                        </button>

                        {/* Accessibility Menu */}
                        {isA11yMenuOpen && (
                            <div className={`absolute bottom-20 right-0 w-80 rounded-2xl shadow-2xl p-6 border mb-2 slide-up-fade-in ${highContrast ? 'bg-gray-900 border-white text-white' : 'bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900'}`}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <Eye size={20} className="text-indigo-600" /> Accessibility
                                    </h3>
                                    <button
                                        onClick={() => setIsA11yMenuOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* High Contrast */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Moon size={20} className="text-gray-600" />
                                            <span className="font-semibold text-sm">High Contrast</span>
                                        </div>
                                        <button
                                            onClick={() => setHighContrast(!highContrast)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${highContrast ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                            aria-pressed={highContrast}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Font Size */}
                                    <div className="space-y-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Type size={20} className="text-gray-600" />
                                            <span className="font-semibold text-sm">Font Size: {fontSize}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                                                className="p-2 bg-white border border-gray-200 rounded-lg flex-1 flex justify-center hover:bg-gray-50 transition-colors shadow-sm"
                                                aria-label="Decrease Font Size"
                                            >
                                                <ZoomOut size={18} />
                                            </button>
                                            <button
                                                onClick={() => setFontSize(100)}
                                                className="p-2 bg-white border border-gray-200 rounded-lg flex-1 text-xs font-bold flex justify-center hover:bg-gray-50 transition-colors shadow-sm"
                                                aria-label="Reset Font Size"
                                            >
                                                100%
                                            </button>
                                            <button
                                                onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                                                className="p-2 bg-white border border-gray-200 rounded-lg flex-1 flex justify-center hover:bg-gray-50 transition-colors shadow-sm"
                                                aria-label="Increase Font Size"
                                            >
                                                <ZoomIn size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reduce Motion */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Activity size={20} className="text-gray-600" />
                                            <span className="font-semibold text-sm">Reduce Motion</span>
                                        </div>
                                        <button
                                            onClick={() => setReduceMotion(!reduceMotion)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${reduceMotion ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                            aria-pressed={reduceMotion}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Keyboard Shortcuts Info */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Navigation</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-gray-600">
                                                <span>Home</span>
                                                <kbd className="font-sans font-bold text-indigo-600">^H</kbd>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-gray-600">
                                                <span>Quizzes</span>
                                                <kbd className="font-sans font-bold text-indigo-600">^Q</kbd>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-gray-600">
                                                <span>Profile</span>
                                                <kbd className="font-sans font-bold text-indigo-600">^P</kbd>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-gray-600">
                                                <span>Close</span>
                                                <kbd className="font-sans font-bold text-indigo-600">ESC</kbd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;

