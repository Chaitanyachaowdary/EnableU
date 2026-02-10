import React from 'react';

/**
 * Senior Best Practice: Skeleton Loading
 * Provides immediate visual feedback during data fetching.
 */
export const SkeletonCard = () => (
    <div className="glass-effect rounded-3xl p-8 border border-white/50 animate-pulse">
        <div className="flex justify-between mb-6">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
        <div className="w-32 h-3 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
    </div>
);

export const SkeletonLeaderboard = () => (
    <div className="glass-effect rounded-3xl p-8 border border-white/50 animate-pulse">
        <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div>
                            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                            <div className="w-16 h-3 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                        </div>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
            ))}
        </div>
    </div>
);
