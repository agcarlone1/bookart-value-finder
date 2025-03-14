
import { useState, useCallback } from 'react';
import { ShoppingResult, SearchOptions } from '@/services/api/types';
import { searchProducts } from '@/services/api/shoppingSearchService';
import { toast } from "@/components/ui/use-toast"
import { mockSearchResults } from '@/services/api/mockData';

interface SearchContextProps {
  searchTerm: string;
  searchResults: ShoppingResult[] | null;
  isSearching: boolean;
  isMockData: boolean;
  error: string | null;
  performSearch: (searchOptions: { type: 'text' | 'image' | 'url', value: string | File }) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: ShoppingResult[]) => void;
  setIsMockData: (isMock: boolean) => void;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

const useSearchProvider = ({ children }: SearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ShoppingResult[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMockData, setIsMockData] = useState<boolean>(true); // Always use mock data
  const [error, setError] = useState<string | null>(null);

  const uploadAndGetImageUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to process image'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleTextSearch = useCallback(async (query: string, options?: SearchOptions): Promise<ShoppingResult[]> => {
    try {
      setIsSearching(true);
      setSearchTerm(query);
      setError(null);

      // Always use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return mockSearchResults;
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to perform search';
      setError(errorMessage);
      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleImageSearch = async (value: File | string): Promise<ShoppingResult[]> => {
    try {
      setIsSearching(true);
      setError(null);
      console.log('Starting image search with value type:', typeof value);
    
      // Get the image URL (either from File or direct URL)
      let imageUrl;
      if (typeof value === 'string') {
        imageUrl = value;
      } else {
        try {
          imageUrl = await uploadAndGetImageUrl(value);
        } catch (err) {
          console.error('Error uploading image:', err);
          // Continue with mock data even if image upload fails
        }
      }
      
      console.log('Using mock data for image search');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock data with customized titles to simulate image results
      return mockSearchResults.map((result, index) => ({
        ...result,
        title: `${typeof value === 'string' ? 'URL' : 'Image'} Search Result ${index + 1}`,
      }));
    } catch (error) {
      console.error('Image search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to search image';
      setError(errorMessage);
      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const performSearch = useCallback(async (searchOptions: { type: 'text' | 'image' | 'url', value: string | File }) => {
    setSearchResults(null);
    setSearchTerm('');
    setError(null);

    try {
      console.log('Performing search with type:', searchOptions.type);
      let results: ShoppingResult[] = [];

      if (searchOptions.type === 'text') {
        results = await handleTextSearch(searchOptions.value as string);
      } else if (searchOptions.type === 'image' || searchOptions.type === 'url') {
        results = await handleImageSearch(searchOptions.value);
      }

      console.log('Search completed, found results:', results.length);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during the search. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [handleTextSearch]);

  return {
    searchTerm,
    searchResults,
    isSearching,
    isMockData,
    error,
    performSearch,
    setSearchTerm,
    setSearchResults,
    setIsMockData,
  };
};

export { useSearchProvider };
