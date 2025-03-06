
import { WishlistItem, SearchHistoryItem } from './types';

// Mock API functions (replace these with actual API calls to your backend)
export const fetchUserWishlist = async (userId: string): Promise<WishlistItem[]> => {
  // In a real app, this would be an API call to your backend
  const localWishlist = localStorage.getItem(`wishlist_${userId}`);
  return localWishlist ? JSON.parse(localWishlist) : [];
};

export const fetchUserSearchHistory = async (userId: string): Promise<SearchHistoryItem[]> => {
  // In a real app, this would be an API call to your backend
  const localHistory = localStorage.getItem(`searchHistory_${userId}`);
  return localHistory ? JSON.parse(localHistory) : [];
};

export const saveUserWishlist = async (userId: string, items: WishlistItem[]): Promise<void> => {
  // In a real app, this would be an API call to your backend
  localStorage.setItem(`wishlist_${userId}`, JSON.stringify(items));
  return Promise.resolve();
};

export const saveUserSearchHistory = async (userId: string, items: SearchHistoryItem[]): Promise<void> => {
  // In a real app, this would be an API call to your backend
  localStorage.setItem(`searchHistory_${userId}`, JSON.stringify(items));
  return Promise.resolve();
};

// Local storage functions for non-authenticated users
export const getLocalWishlist = (): WishlistItem[] => {
  const savedWishlist = localStorage.getItem('wishlist');
  return savedWishlist ? JSON.parse(savedWishlist) : [];
};

export const saveLocalWishlist = (items: WishlistItem[]): void => {
  localStorage.setItem('wishlist', JSON.stringify(items));
};

export const getLocalSearchHistory = (): SearchHistoryItem[] => {
  const savedHistory = localStorage.getItem('searchHistory');
  return savedHistory ? JSON.parse(savedHistory) : [];
};

export const saveLocalSearchHistory = (items: SearchHistoryItem[]): void => {
  localStorage.setItem('searchHistory', JSON.stringify(items));
};
