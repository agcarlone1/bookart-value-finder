
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from '../ui-custom/AnimatedLogo';
import { Button } from '@/components/ui/button';
import { User, Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

const Header: React.FC = () => {
  const { wishlistItems } = useWishlist();
  
  return (
    <header className="w-full py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-light-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <AnimatedLogo />
        </Link>
        
        <div className="flex items-center gap-3">
          <Link to="/wishlist">
            <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground relative">
              <Heart size={18} className="mr-1" />
              <span>Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <User size={18} className="mr-1" />
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
