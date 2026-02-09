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

    const value = {
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        reduceMotion,
        setReduceMotion
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};
