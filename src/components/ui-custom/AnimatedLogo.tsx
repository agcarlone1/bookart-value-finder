
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="text-2xl font-semibold text-primary animate-logo-pulse relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          ValueFinder
        </span>
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
      </div>
    </div>
  );
};

export default AnimatedLogo;
