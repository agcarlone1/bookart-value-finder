
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  type: 'highest-price' | 'price-spread' | 'resale-potential';
  value: number | string;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ type, value, className }) => {
  const renderIcon = () => {
    switch (type) {
      case 'highest-price':
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case 'price-spread':
        return <DollarSign className="h-5 w-5 text-emerald-500" />;
      case 'resale-potential':
        return <Gem className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  const renderTitle = () => {
    switch (type) {
      case 'highest-price':
        return 'Highest Price Found';
      case 'price-spread':
        return 'Price Spread';
      case 'resale-potential':
        return 'Resale Potential Score';
      default:
        return '';
    }
  };

  const renderDescription = () => {
    switch (type) {
      case 'highest-price':
        return 'The highest price available for this item';
      case 'price-spread':
        return 'Difference between highest and lowest price';
      case 'resale-potential':
        return 'Estimated profit potential based on price distribution';
      default:
        return '';
    }
  };

  const formatValue = () => {
    if (type === 'resale-potential') {
      // If it's a score, return as is
      return value;
    }
    // For price values, format as currency
    return `$${Number(value).toFixed(2)}`;
  };

  return (
    <div 
      className={cn(
        'rounded-xl overflow-hidden border bg-white p-4 transition-all duration-300 hover:shadow-light-md',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-secondary/50">
          {renderIcon()}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-sm font-medium text-muted-foreground">
            {renderTitle()}
          </h3>
          <div className="mt-1 text-xl font-semibold text-foreground">
            {formatValue()}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {renderDescription()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
