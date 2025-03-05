
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tag, TrendingUp } from 'lucide-react';

interface TabViewProps {
  className?: string;
  children: React.ReactNode;
}

const TabView: React.FC<TabViewProps> = ({ className, children }) => {
  const [activeTab, setActiveTab] = useState<'lowest-price' | 'insights'>('lowest-price');

  return (
    <div className={cn('w-full rounded-lg overflow-hidden bg-white shadow-light-md', className)}>
      <div className="flex border-b">
        <button
          type="button"
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-300',
            activeTab === 'lowest-price' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('lowest-price')}
        >
          <Tag size={16} />
          <span>Lowest Price</span>
        </button>
        
        <button
          type="button"
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-300',
            activeTab === 'insights' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('insights')}
        >
          <TrendingUp size={16} />
          <span>Insights</span>
        </button>
      </div>
      
      <div className="p-4">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          
          return React.cloneElement(child as React.ReactElement, {
            className: cn(
              'transition-opacity duration-300',
              (index === 0 && activeTab === 'lowest-price') || (index === 1 && activeTab === 'insights')
                ? 'block opacity-100'
                : 'hidden opacity-0'
            )
          });
        })}
      </div>
    </div>
  );
};

export default TabView;
