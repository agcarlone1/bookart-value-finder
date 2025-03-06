
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

// Define types for our wishlist items
export interface WishlistItem {
  id: string;
  name: string;
  storeName: string;
  price: number;
  imageUrl: string;
  link: string;
  addedAt: string;
}

// Define type for search history
export interface SearchHistoryItem {
  id: string;
  searchTerm: string;
  searchType: 'image' | 'url';
  timestamp: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  searchHistory: SearchHistoryItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  clearSearchHistory: () => void;
  addToSearchHistory: (searchTerm: string, searchType: 'image' | 'url') => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const { toast } = useToast();

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
    
    const savedSearchHistory = localStorage.getItem('searchHistory');
    if (savedSearchHistory) {
      setSearchHistory(JSON.parse(savedSearchHistory));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Add a product to the wishlist
  const addToWishlist = (product: any) => {
    const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (!isAlreadyInWishlist) {
      const newItem: WishlistItem = {
        ...product,
        addedAt: new Date().toISOString()
      };
      
      setWishlistItems(prev => [newItem, ...prev]);
      
      sonnerToast.success('Added to Wishlist', {
        description: product.name,
      });
    } else {
      // If already in wishlist, remove it (toggle behavior)
      removeFromWishlist(product.id);
    }
  };

  // Remove a product from the wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    
    sonnerToast.success('Removed from Wishlist', {
      description: 'Item removed successfully',
    });
  };

  // Check if a product is already in the wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Add search to history
  const addToSearchHistory = (searchTerm: string, searchType: 'image' | 'url') => {
    const newSearch: SearchHistoryItem = {
      id: Date.now().toString(),
      searchTerm,
      searchType,
      timestamp: new Date().toISOString()
    };
    
    setSearchHistory(prev => [newSearch, ...prev.slice(0, 19)]); // Keep last 20 searches
  };

  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist."
    });
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    toast({
      title: "Search History Cleared",
      description: "Your search history has been cleared."
    });
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      searchHistory,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      clearSearchHistory,
      addToSearchHistory,
    }}>
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
