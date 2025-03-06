
import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui-custom/ProductCard';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';

const WishlistItems = ({
  onClearWishlist
}: {
  onClearWishlist: () => void;
}) => {
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();
  
  // Format the products for ProductCard component
  const formatProducts = (items: any[]) => {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      storeName: item.storeName,
      price: item.price,
      imageUrl: item.imageUrl,
      link: item.link
    }));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-primary" />
          <span className="text-lg font-medium">
            {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
        
        {wishlistItems.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearWishlist}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <Trash2 size={14} className="mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-slide-up">
          {formatProducts(wishlistItems).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Your wishlist is empty. Add items by clicking the heart icon on products.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Start Searching
          </Button>
        </div>
      )}
    </div>
  );
};

export default WishlistItems;
