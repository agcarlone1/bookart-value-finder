
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    storeName: string;
    price: number;
    imageUrl: string;
    link: string;
  };
  className?: string;
  isBestValue?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className, isBestValue = false }) => {
  return (
    <div 
      className={cn(
        'group relative border overflow-hidden bg-white transition-all duration-300 hover:shadow-light-md',
        isBestValue ? 'ring-2 ring-primary' : 'ring-0',
        className
      )}
    >
      {isBestValue && (
        <div className="absolute top-0 left-0 right-0 bg-primary text-xs font-medium text-white text-center py-0.5 px-2 z-10">
          Best Value
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="relative w-full h-[120px] bg-secondary/10 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="flex flex-col p-3">
          <div className="flex items-center gap-1 mb-1">
            <div className="text-xs text-muted-foreground truncate">{product.storeName}</div>
            {isBestValue && (
              <div className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2">
                {Math.floor(Math.random() * 70 + 30)}% less
              </div>
            )}
          </div>
          
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">{product.name}</h3>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-base font-semibold">${product.price.toFixed(2)}</span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs group-hover:text-primary transition-colors duration-300"
              asChild
            >
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <span>View</span>
                <ArrowRight size={12} className="ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
