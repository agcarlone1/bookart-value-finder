
import React from 'react';

const ResultSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white overflow-hidden animate-pulse">
          <div className="h-[120px] bg-secondary"></div>
          <div className="p-3 space-y-2">
            <div className="h-2 bg-secondary rounded w-1/4"></div>
            <div className="h-3 bg-secondary rounded w-3/4"></div>
            <div className="h-2 bg-secondary rounded w-1/2 mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultSkeleton;
