
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Mock API functions (replace these with actual API calls to your backend)
const fetchUserWishlist = async (userId: string): Promise<WishlistItem[]> => {
  // In a real app, this would be an API call to your backend
  const localWishlist = localStorage.getItem(`wishlist_${userId}`);
  return localWishlist ? JSON.parse(localWishlist) : [];
};

const fetchUserSearchHistory = async (userId: string): Promise<SearchHistoryItem[]> => {
  // In a real app, this would be an API call to your backend
  const localHistory = localStorage.getItem(`searchHistory_${userId}`);
  return localHistory ? JSON.parse(localHistory) : [];
};

const saveUserWishlist = async (userId: string, items: WishlistItem[]): Promise<void> => {
  // In a real app, this would be an API call to your backend
  localStorage.setItem(`wishlist_${userId}`, JSON.stringify(items));
  return Promise.resolve();
};

const saveUserSearchHistory = async (userId: string, items: SearchHistoryItem[]): Promise<void> => {
  // In a real app, this would be an API call to your backend
  localStorage.setItem(`searchHistory_${userId}`, JSON.stringify(items));
  return Promise.resolve();
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userId, isAuthenticated, isLoading: authLoading } = useAuth();
  const [localWishlistItems, setLocalWishlistItems] = useState<WishlistItem[]>([]);
  const [localSearchHistory, setLocalSearchHistory] = useState<SearchHistoryItem[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wishlist and search history for authenticated users
  const { 
    data: userWishlist = [], 
    isLoading: wishlistLoading,
    refetch: refetchWishlist
  } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => fetchUserWishlist(userId || ''),
    enabled: isAuthenticated && !!userId,
  });

  const { 
    data: userSearchHistory = [], 
    isLoading: historyLoading,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['searchHistory', userId],
    queryFn: () => fetchUserSearchHistory(userId || ''),
    enabled: isAuthenticated && !!userId,
  });

  // Save wishlist mutation
  const saveWishlistMutation = useMutation({
    mutationFn: (items: WishlistItem[]) => saveUserWishlist(userId || '', items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    }
  });

  // Save search history mutation
  const saveSearchHistoryMutation = useMutation({
    mutationFn: (items: SearchHistoryItem[]) => saveUserSearchHistory(userId || '', items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', userId] });
    }
  });

  // Load local wishlist from localStorage on initial render
  useEffect(() => {
    if (!isAuthenticated) {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setLocalWishlistItems(JSON.parse(savedWishlist));
      }
      
      const savedSearchHistory = localStorage.getItem('searchHistory');
      if (savedSearchHistory) {
        setLocalSearchHistory(JSON.parse(savedSearchHistory));
      }
    }
  }, [isAuthenticated]);

  // Save local wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(localWishlistItems));
    }
  }, [localWishlistItems, isAuthenticated]);

  // Save local search history to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('searchHistory', JSON.stringify(localSearchHistory));
    }
  }, [localSearchHistory, isAuthenticated]);

  // Get the appropriate wishlist and search history based on authentication status
  const wishlistItems = isAuthenticated ? userWishlist : localWishlistItems;
  const searchHistory = isAuthenticated ? userSearchHistory : localSearchHistory;
  const isLoading = authLoading || (isAuthenticated && (wishlistLoading || historyLoading));

  // Add a product to the wishlist
  const addToWishlist = (product: any) => {
    const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (!isAlreadyInWishlist) {
      const newItem: WishlistItem = {
        ...product,
        addedAt: new Date().toISOString()
      };
      
      if (isAuthenticated && userId) {
        const updatedWishlist = [newItem, ...userWishlist];
        saveWishlistMutation.mutate(updatedWishlist);
      } else {
        setLocalWishlistItems(prev => [newItem, ...prev]);
      }
      
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
    if (isAuthenticated && userId) {
      const updatedWishlist = userWishlist.filter(item => item.id !== productId);
      saveWishlistMutation.mutate(updatedWishlist);
    } else {
      setLocalWishlistItems(prev => prev.filter(item => item.id !== productId));
    }
    
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
    
    if (isAuthenticated && userId) {
      const updatedHistory = [newSearch, ...userSearchHistory.slice(0, 19)]; // Keep last 20 searches
      saveSearchHistoryMutation.mutate(updatedHistory);
    } else {
      setLocalSearchHistory(prev => [newSearch, ...prev.slice(0, 19)]); // Keep last 20 searches
    }
  };

  // Clear the entire wishlist
  const clearWishlist = () => {
    if (isAuthenticated && userId) {
      saveWishlistMutation.mutate([]);
    } else {
      setLocalWishlistItems([]);
    }
    
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist."
    });
  };

  // Clear search history
  const clearSearchHistory = () => {
    if (isAuthenticated && userId) {
      saveSearchHistoryMutation.mutate([]);
    } else {
      setLocalSearchHistory([]);
    }
    
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
      isLoading
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
