
import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';

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
  const { addToWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  
  return (
    <div 
      className={cn(
        'group relative border overflow-hidden bg-white transition-all duration-300 hover:shadow-light-md',
        isBestValue ? 'ring-2 ring-primary' : 'ring-0',
        className
      )}
    >
      <div className="flex flex-col">
        <div className="relative w-full h-[120px] bg-secondary/10 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 shadow-sm",
              inWishlist ? "text-primary" : "text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToWishlist(product);
            }}
          >
            <Heart size={14} className={cn(inWishlist ? "fill-primary" : "")} />
          </Button>
        </div>
        
        <div className="flex flex-col p-3">
          <div className="flex items-center gap-1 mb-1">
            <div className="text-xs text-muted-foreground truncate">{product.storeName}</div>
            {isBestValue && (
              <div className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2">
                Best Value
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
