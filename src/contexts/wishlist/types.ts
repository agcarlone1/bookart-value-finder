
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

export interface WishlistContextType {
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
