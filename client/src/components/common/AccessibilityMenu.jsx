import React, { useState } from 'react';
import { Settings, Type, Eye, MousePointer, Monitor, X, Accessibility, Plus, Minus } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const AccessibilityMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        fontSize, setFontSize,
        highContrast, setHighContrast,
        reduceMotion, setReduceMotion,
        dyslexicFont, setDyslexicFont,
        readingGuide, setReadingGuide,
        announce
    } = useAccessibility();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleFontSizeChange = (increment) => {
        const newSize = Math.min(Math.max(fontSize + increment, 80), 150);
        setFontSize(newSize);
        announce(`Font size set to ${newSize}%`);
    };

    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
        announce(highContrast ? 'High contrast disabled' : 'High contrast enabled');
    };

    const toggleDyslexicFont = () => {
        setDyslexicFont(!dyslexicFont);
        announce(dyslexicFont ? 'Dyslexic font disabled' : 'Dyslexic font enabled');
    };

    const toggleReadingGuide = () => {
        setReadingGuide(!readingGuide);
        announce(readingGuide ? 'Reading guide disabled' : 'Reading guide enabled');
    };

    const toggleReduceMotion = () => {
        setReduceMotion(!reduceMotion);
        announce(reduceMotion ? 'Reduced motion disabled' : 'Reduced motion enabled');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Menu Panel */}
            {isOpen && (
                <div className="mb-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-72 border border-gray-200 dark:border-gray-700 animate-slide-up-fade">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Accessibility size={20} className="text-indigo-600" />
                            Accessibility
                        </h3>
                        <button onClick={toggleMenu} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Font Size */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Type size={16} /> Text Size
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <button
                                    onClick={() => handleFontSizeChange(-10)}
                                    className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
                                    aria-label="Decrease text size"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="text-xs font-bold w-8 text-center">{fontSize}%</span>
                                <button
                                    onClick={() => handleFontSizeChange(10)}
                                    className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
                                    aria-label="Increase text size"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-2">
                            <button
                                onClick={toggleHighContrast}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highContrast ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white'}`}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <Monitor size={16} /> High Contrast
                                </span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-500'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>

                            <button
                                onClick={toggleDyslexicFont}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${dyslexicFont ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white'}`}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <Type size={16} /> Dyslexia Font
                                </span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${dyslexicFont ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-500'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${dyslexicFont ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>

                            <button
                                onClick={toggleReadingGuide}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${readingGuide ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white'}`}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <MousePointer size={16} /> Reading Guide
                                </span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${readingGuide ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-500'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${readingGuide ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>

                            <button
                                onClick={toggleReduceMotion}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${reduceMotion ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white'}`}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <Eye size={16} /> Reduce Motion
                                </span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${reduceMotion ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-500'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${reduceMotion ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleMenu}
                className="p-4 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                aria-label="Open Accessibility Menu"
                title="Accessibility Settings"
            >
                <Accessibility size={28} />
            </button>
        </div>
    );
};

export default AccessibilityMenu;
