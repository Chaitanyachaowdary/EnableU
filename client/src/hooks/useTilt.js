import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to apply a 3D tilt effect based on mouse movement.
 * @param {number} maxRotation - Maximum rotation in degrees.
 * @returns {object} { ref, style, onMouseMove, onMouseLeave }
 */
export const useTilt = (maxRotation = 10) => {
    const [style, setStyle] = useState({});
    const ref = useRef(null);

    const onMouseMove = useCallback((e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out'
        });
    }, [maxRotation]);

    const onMouseLeave = useCallback(() => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.5s ease-out'
        });
    }, []);

    return { ref, style, onMouseMove, onMouseLeave };
};
