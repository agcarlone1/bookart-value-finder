
import { useState, useCallback } from 'react';
import { ShoppingResult, SearchOptions } from '@/services/api/types';
import { searchProducts } from '@/services/api/shoppingSearchService';
import { toast } from "@/components/ui/use-toast"
import { USE_MOCK_DATA } from '@/services/api/apiConfig';
import { mockSearchResults } from '@/services/api/mockData';
import { fetchImageSearchResults } from '@/services/api';

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
  const [isMockData, setIsMockData] = useState<boolean>(USE_MOCK_DATA);
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

      if (isMockData) {
        // Simulate an API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSearchResults;
      }

      const results = await searchProducts({ query, ...(options || {}) });
      return results.shopping_results || [];
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
  }, [isMockData]);

  const handleImageSearch = async (value: File | string): Promise<ShoppingResult[]> => {
    try {
      setIsSearching(true);
      setError(null);
      console.log('Starting image search with value type:', typeof value);
    
      // Get the image URL (either from File or direct URL)
      const imageUrl = typeof value === 'string' 
        ? value 
        : await uploadAndGetImageUrl(value);
    
      if (!imageUrl) {
        throw new Error('Failed to process image');
      }
      
      console.log('Image processed successfully, calling API endpoint');
    
      // Use the client-side function to call our server endpoint
      const response = await fetchImageSearchResults(imageUrl);
      console.log('API response received:', response);
    
      if (response.error) {
        console.error('API returned error:', response.error);
        
        // Display a more user-friendly error message based on the error
        let userMessage = 'Failed to search image.';
        
        if (response.error.includes('404')) {
          userMessage = 'The API endpoint (/api/google-lens) was not found. Make sure your backend server is running and properly configured.';
        } else if (response.error.includes('Unexpected end of JSON')) {
          userMessage = 'The server returned an empty or invalid response. Check your server logs for more details.';
        } else if (response.error.includes('500')) {
          userMessage = 'The server encountered an error processing your request. Try running the Express server with "node server/index.js" or use the mock data option.';
        }
        
        setError(userMessage);
        
        toast({
          title: 'API Error',
          description: userMessage,
          variant: 'destructive'
        });
        
        throw new Error(response.error);
      }
    
      // Process the response data from the exact_matches field
      if (response.exact_matches && response.exact_matches.length > 0) {
        console.log("Found exact matches:", response.exact_matches.length);
        
        // Map the exact matches to our ShoppingResult format
        const results = response.exact_matches.map((match, index) => ({
          position: index + 1,
          title: match.title || 'Unknown Product',
          link: match.link || '#',
          source: match.source || 'Unknown Source',
          price: match.price || 'N/A',
          extracted_price: match.extracted_price || 0,
          thumbnail: match.thumbnail || '',
          delivery: match.delivery || 'Check website',
          rating: match.rating,
          reviews: match.reviews
        }));
        
        return results;
      }
      
      console.log('No exact matches found in the response');
      return [];
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
