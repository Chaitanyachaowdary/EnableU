import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from '../common/Footer';

import { Menu, Layout as LayoutIcon, Eye, X, ZoomIn, ZoomOut, Moon, Sun, Type } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';


const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isA11yMenuOpen, setIsA11yMenuOpen] = useState(false);

    const {
        fontSize, setFontSize,
        highContrast, setHighContrast,
        reduceMotion, setReduceMotion
    } = useAccessibility();

    // Enable global keyboard shortcuts
    useKeyboardShortcuts();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <a href="#main-content" className="skip-link focus-visible-custom text-center">
                Skip to Main Content
            </a>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${highContrast ? 'bg-black text-white' : ''}`}>
                {/* Mobile Header */}
                <header className={`md:hidden px-4 py-3 border-b flex items-center justify-between shadow-sm z-10 ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`p-2 rounded-lg focus-visible-custom ${highContrast ? 'text-white hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            aria-label="Open Sidebar"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-600 text-white'}`}>
                                <LayoutIcon className="w-4 h-4" />
                            </div>
                            <span className={`font-bold ${highContrast ? 'text-white' : 'text-gray-900'}`}>EnableU</span>
                        </div>
                    </div>
                </header>

                <main id="main-content" className={`flex-1 overflow-y-auto relative ${highContrast ? 'bg-black text-white' : 'bg-gray-50 dark:bg-gray-900'}`} tabIndex="-1">
                    <div className="p-4 md:p-6">
                        <Outlet />
                    </div>

                    {/* Footer at end of content */}
                    <Footer />

                    {/* Accessibility Floating Action Button */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            onClick={() => setIsA11yMenuOpen(!isA11yMenuOpen)}
                            className={`p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus-visible-custom ${highContrast ? 'bg-yellow-400 text-black border-4 border-white' : 'bg-indigo-600 text-white'}`}
                            aria-label="Accessibility Settings"
                            aria-expanded={isA11yMenuOpen}
                        >
                            <Eye size={24} />
                        </button>

                        {/* Accessibility Menu */}
                        {isA11yMenuOpen && (
                            <div className={`absolute bottom-16 right-0 w-72 rounded-xl shadow-2xl p-4 border mb-2 ${highContrast ? 'bg-gray-900 border-white text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Eye size={18} /> Accessibility
                                    </h3>
                                    <button
                                        onClick={() => setIsA11yMenuOpen(false)}
                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* High Contrast */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Moon size={18} />
                                            <span>High Contrast</span>
                                        </div>
                                        <button
                                            onClick={() => setHighContrast(!highContrast)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? 'bg-yellow-400' : 'bg-gray-300'}`}
                                            aria-pressed={highContrast}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Font Size */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Type size={18} />
                                            <span>Font Size: {fontSize}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                            <button
                                                onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                                                className={`p-2 rounded flex-1 flex justify-center ${highContrast ? 'hover:bg-gray-700' : 'hover:bg-white shadow-sm'}`}
                                                aria-label="Decrease Font Size"
                                            >
                                                <ZoomOut size={16} />
                                            </button>
                                            <button
                                                onClick={() => setFontSize(100)}
                                                className={`p-2 text-xs font-mono font-bold flex-1 flex justify-center ${highContrast ? 'hover:bg-gray-700' : 'hover:bg-white shadow-sm'}`}
                                                aria-label="Reset Font Size"
                                            >
                                                100%
                                            </button>
                                            <button
                                                onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                                                className={`p-2 rounded flex-1 flex justify-center ${highContrast ? 'hover:bg-gray-700' : 'hover:bg-white shadow-sm'}`}
                                                aria-label="Increase Font Size"
                                            >
                                                <ZoomIn size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reduce Motion */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Reduce Motion</span>
                                        </div>
                                        <button
                                            onClick={() => setReduceMotion(!reduceMotion)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reduceMotion ? 'bg-green-600' : 'bg-gray-300'}`}
                                            aria-pressed={reduceMotion}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Keyboard Shortcuts Info */}
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Keyboard Shortcuts:</p>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                            <p><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+H</kbd> Home</p>
                                            <p><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Q</kbd> Quizzes</p>
                                            <p><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+P</kbd> Profile</p>
                                            <p><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> Close Menu</p>
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

