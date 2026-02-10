import React, { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const ReadingGuide = () => {
    const { readingGuide } = useAccessibility();
    const guideRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!readingGuide) return;

        const handleMouseMove = (e) => {
            if (guideRef.current) {
                // Use requestAnimationFrame for performance
                requestAnimationFrame(() => {
                    if (guideRef.current) {
                        guideRef.current.style.top = `${e.clientY}px`;
                    }
                });
            }
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [readingGuide, isVisible]);

    if (!readingGuide) return null;

    return (
        <div
            ref={guideRef}
            className={`reading-guide-overlay ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden="true"
        />
    );
};

export default ReadingGuide;
