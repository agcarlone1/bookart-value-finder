
import React from 'react';

const InsightsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-xl border bg-white p-4 animate-pulse">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-secondary mb-1"></div>
            <div className="w-full text-center space-y-2">
              <div className="h-2 bg-secondary rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-secondary rounded w-1/2 mx-auto"></div>
              <div className="h-2 bg-secondary rounded w-full mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightsSkeleton;
