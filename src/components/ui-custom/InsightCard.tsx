
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Sigma, ListOrdered, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  type: 'highest-price' | 'lowest-price' | 'profit' | 'average-price' | 'listing-count' | 'resale-potential';
  value: number | string;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ type, value, className }) => {
  const renderIcon = () => {
    switch (type) {
      case 'highest-price':
        return <TrendingUp className="h-4 w-4 text-amber-500" />;
      case 'lowest-price':
        return <TrendingDown className="h-4 w-4 text-emerald-500" />;
      case 'profit':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'average-price':
        return <Sigma className="h-4 w-4 text-blue-500" />;
      case 'listing-count':
        return <ListOrdered className="h-4 w-4 text-purple-500" />;
      case 'resale-potential':
        return <Star className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  const renderTitle = () => {
    switch (type) {
      case 'highest-price':
        return 'Highest Price';
      case 'lowest-price':
        return 'Lowest Price';
      case 'profit':
        return 'Profit Potential';
      case 'average-price':
        return 'Average Price';
      case 'listing-count':
        return '# of Listings';
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
      case 'lowest-price':
        return 'The lowest price available for this item';
      case 'profit':
        return 'Potential profit (Highest Price - Lowest Price)';
      case 'average-price':
        return 'Mean price across all available listings';
      case 'listing-count':
        return 'Total number of listings found for this item';
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
    } else if (type === 'listing-count') {
      // For listing count, return as a number
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
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1.5 rounded-md bg-secondary/50">
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
