import React from 'react';
import { SkeletonCard } from './SkeletonLoaders';

const SkeletonStatsGrid = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonStatsGrid;
