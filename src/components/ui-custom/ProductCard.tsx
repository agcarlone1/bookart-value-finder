
import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
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
        'group relative rounded-xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-light-md',
        isBestValue ? 'ring-2 ring-primary' : 'ring-0',
        className
      )}
    >
      {isBestValue && (
        <div className="absolute top-0 left-0 right-0 bg-primary text-xs font-medium text-white text-center py-1 px-2 z-10">
          Best Value
        </div>
      )}
      
      <div className="flex md:flex-row flex-col h-full">
        <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto flex-shrink-0 bg-secondary/30 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="flex flex-col p-4 flex-grow">
          <div className="mb-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">{product.storeName}</div>
            <h3 className="font-medium text-foreground line-clamp-2">{product.name}</h3>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-baseline mb-3">
              <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300"
              asChild
            >
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <span>View Deal</span>
                <ArrowRight size={14} className="ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
