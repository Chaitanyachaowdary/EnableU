import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * Password Strength Indicator Component
 * Displays real-time password strength feedback with visual indicators
 */
const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
        if (!password) return { score: 0, label: 'none', color: 'gray' };

        let score = 0;
        const checks = {
            length: password.length >= 12,
            minLength: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Calculate score
        if (checks.length) score += 2;
        else if (checks.minLength) score += 1;

        if (checks.uppercase && checks.lowercase) score += 1;
        if (checks.number) score += 0.5;
        if (checks.special) score += 0.5;

        const finalScore = Math.min(Math.floor(score), 4);

        const strength = {
            0: { label: 'Very Weak', color: 'red' },
            1: { label: 'Weak', color: 'orange' },
            2: { label: 'Fair', color: 'yellow' },
            3: { label: 'Strong', color: 'green' },
            4: { label: 'Very Strong', color: 'emerald' }
        };

        return { score: finalScore, ...strength[finalScore], checks };
    };

    const strength = getStrength();

    const colorClasses = {
        gray: 'bg-gray-200 dark:bg-gray-700',
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500',
        emerald: 'bg-emerald-500'
    };

    const requirements = [
        { key: 'length', label: 'At least 12 characters', met: strength.checks?.length },
        { key: 'uppercase', label: 'One uppercase letter', met: strength.checks?.uppercase },
        { key: 'lowercase', label: 'One lowercase letter', met: strength.checks?.lowercase },
        { key: 'number', label: 'One number', met: strength.checks?.number },
        { key: 'special', label: 'One special character (!@#$...)', met: strength.checks?.special }
    ];

    if (!password) return null;

    return (
        <div className="mt-3 space-y-2">
            {/* Strength Bar */}
            <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-2 flex-1 rounded transition-all duration-300 ${level <= strength.score
                                ? colorClasses[strength.color]
                                : colorClasses.gray
                            }`}
                    />
                ))}
            </div>

            {/* Strength Label */}
            {strength.label !== 'none' && (
                <p className={`text-sm font-medium text-${strength.color}-600 dark:text-${strength.color}-400`}>
                    Password Strength: {strength.label}
                </p>
            )}

            {/* Requirements Checklist */}
            <div className="mt-3 space-y-1 bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password Requirements:
                </p>
                {requirements.map((req) => (
                    <div key={req.key} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                            <X className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        )}
                        <span className={req.met ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
