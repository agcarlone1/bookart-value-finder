import { createContext, useContext, useState, useCallback } from 'react';
import { ShoppingResult, SearchOptions } from '@/services/api/types';
import { searchShoppingResults } from '@/services/api/shoppingSearchService';
import { toast } from "@/components/ui/use-toast"
import { USE_MOCK_DATA } from '@/services/api/apiConfig';
import { mockSearchResults } from '@/services/api/mockData';
import { fetchImageSearchResults } from '@/services/api';

interface SearchContextProps {
  searchTerm: string;
  searchResults: ShoppingResult[] | null;
  isSearching: boolean;
  isMockData: boolean;
  performSearch: (searchOptions: { type: 'text' | 'image' | 'url', value: string | File }) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: ShoppingResult[]) => void;
  setIsMockData: (isMock: boolean) => void;
}

const SearchContext = createContext<SearchContextProps>({
  searchTerm: '',
  searchResults: null,
  isSearching: false,
  isMockData: false,
  performSearch: async () => { },
  setSearchTerm: () => { },
  setSearchResults: () => { },
  setIsMockData: () => { },
});

interface SearchProviderProps {
  children: React.ReactNode;
}

const useSearchProvider = ({ children }: SearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ShoppingResult[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMockData, setIsMockData] = useState<boolean>(USE_MOCK_DATA);

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

      if (isMockData) {
        // Simulate an API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSearchResults;
      }

      const results = await searchShoppingResults(query, options);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: error instanceof Error ? error.message : 'Failed to perform search',
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
    
      // Get the image URL (either from File or direct URL)
      const imageUrl = typeof value === 'string' 
        ? value 
        : await uploadAndGetImageUrl(value);
    
      if (!imageUrl) {
        throw new Error('Failed to process image');
      }
    
      // Call our server-side API via the client function
      const response = await fetchImageSearchResults(imageUrl);
    
      if (response.error) {
        throw new Error(response.error);
      }
    
      // Process the response data
      const results = response.exact_matches?.map((match, index) => ({
        position: index + 1,
        title: match.title,
        link: match.link,
        source: match.source,
        price: match.price || 'N/A',
        extracted_price: match.extracted_price || 0,
        thumbnail: match.thumbnail,
        delivery: 'Check website',
        rating: match.rating,
        reviews: match.reviews
      })) || [];
    
      return results;
    } catch (error) {
      console.error('Image search error:', error);
      toast({
        title: 'Search Error',
        description: error instanceof Error ? error.message : 'Failed to search image',
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

    try {
      let results: ShoppingResult[] = [];

      if (searchOptions.type === 'text') {
        results = await handleTextSearch(searchOptions.value as string);
      } else if (searchOptions.type === 'image' || searchOptions.type === 'url') {
        results = await handleImageSearch(searchOptions.value);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search Error',
        description: 'An error occurred during the search. Please try again.',
        variant: 'destructive'
      });
    }
  }, [handleTextSearch, handleImageSearch]);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        searchResults,
        isSearching,
        isMockData,
        performSearch,
        setSearchTerm,
        setSearchResults,
        setIsMockData,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearchProvider as SearchProvider, useSearch };
