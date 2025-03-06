
import React, { createContext, useContext, ReactNode } from 'react';
import { WishlistContextType } from './types';
import { useWishlistOperations } from './useWishlistOperations';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const wishlistOperations = useWishlistOperations();
  
  return (
    <WishlistContext.Provider value={wishlistOperations}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
