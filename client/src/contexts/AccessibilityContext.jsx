import React, { createContext, useState, useEffect, useContext } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
    // Initialize state from localStorage or defaults
    const [fontSize, setFontSize] = useState(() => {
        return parseInt(localStorage.getItem('a11y-fontSize') || '100');
    });

    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem('a11y-highContrast') === 'true';
    });

    const [reduceMotion, setReduceMotion] = useState(() => {
        return localStorage.getItem('a11y-reduceMotion') === 'true';
    });

    const [dyslexicFont, setDyslexicFont] = useState(() => {
        return localStorage.getItem('a11y-dyslexicFont') === 'true';
    });

    const [readingGuide, setReadingGuide] = useState(() => {
        return localStorage.getItem('a11y-readingGuide') === 'true';
    });

    // Screen Reader Announcer
    const announce = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('role', 'status');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 3000);
    };

    // Persist changes
    useEffect(() => {
        localStorage.setItem('a11y-fontSize', fontSize);
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem('a11y-highContrast', highContrast);
        if (highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [highContrast]);

    useEffect(() => {
        localStorage.setItem('a11y-reduceMotion', reduceMotion);
        if (reduceMotion) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }, [reduceMotion]);

    useEffect(() => {
        localStorage.setItem('a11y-dyslexicFont', dyslexicFont);
        if (dyslexicFont) {
            document.body.classList.add('dyslexic-font');
        } else {
            document.body.classList.remove('dyslexic-font');
        }
    }, [dyslexicFont]);

    useEffect(() => {
        localStorage.setItem('a11y-readingGuide', readingGuide);
        if (readingGuide) {
            document.body.classList.add('reading-guide-active');
        } else {
            document.body.classList.remove('reading-guide-active');
        }
    }, [readingGuide]);

    const value = {
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        reduceMotion,
        setReduceMotion,
        dyslexicFont,
        setDyslexicFont,
        readingGuide,
        setReadingGuide,
        announce
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
            {/* Reading Guide Overlay */}
            {readingGuide && <div className="reading-guide-overlay" />}
        </AccessibilityContext.Provider>
    );
};
