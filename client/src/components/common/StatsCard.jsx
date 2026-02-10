import React from 'react';
import { useTilt } from '../../hooks/useTilt';
import { useAccessibility } from '../../contexts/AccessibilityContext';

/**
 * Senior Best Practice: Reusable Premium UI Component
 * Encapsulates 3D Tilt, Glassmorphism, and Accessibility.
 */
const StatsCard = ({ icon: Icon, label, value, subValue, colorClass = "indigo", tiltStrength = 5 }) => {
    const { reduceMotion } = useAccessibility();
    const { ref, style, onMouseMove, onMouseLeave } = useTilt(tiltStrength);

    const colorMap = {
        indigo: "bg-indigo-100 text-indigo-600",
        yellow: "bg-yellow-100 text-yellow-600",
        emerald: "bg-emerald-100 text-emerald-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
    };

    return (
        <div
            ref={!reduceMotion ? ref : null}
            style={!reduceMotion ? style : {}}
            onMouseMove={!reduceMotion ? onMouseMove : null}
            onMouseLeave={!reduceMotion ? onMouseLeave : null}
            className="glass-effect rounded-3xl shadow-xl p-8 depth-layer-1 border border-white/50 preserve-3d transition-transform duration-200"
        >
            <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl shadow-inner ${colorMap[colorClass] || colorMap.indigo}`}>
                    <Icon size={28} />
                </div>
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                    {value}
                </span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</h3>
            {subValue && (
                <p className={`text-xs font-bold mt-2 text-${colorClass}-600`}>
                    {subValue}
                </p>
            )}
        </div>
    );
};

export default StatsCard;
