import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { searchProducts, extractSearchQueryFromImage } from '@/services/api';
import { useWishlist } from './WishlistContext';

type SearchType = 'image' | 'url';

interface SearchContextType {
  searchTerm: string;
  searchType: SearchType;
  isSearching: boolean;
  searchResults: any[] | null;
  performSearch: (data: { type: SearchType, value: string | File }) => Promise<void>;
  clearSearch: () => void;
  isMockData: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('image');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isMockData, setIsMockData] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToSearchHistory } = useWishlist();

  const performSearch = async (data: { type: SearchType, value: string | File }) => {
    try {
      setIsSearching(true);
      setSearchType(data.type);
      setIsMockData(false);
      
      let query = '';
      
      if (data.type === 'image' && data.value instanceof File) {
        sonnerToast.loading('Analyzing image with Google Lens...', {
          id: 'image-analysis',
          duration: 15000,
        });
        
        console.log('Starting image analysis with file:', data.value.name, 'size:', data.value.size);
        
        try {
          query = await extractSearchQueryFromImage(data.value);
          
          sonnerToast.success('Image analyzed', {
            id: 'image-analysis',
            description: `Searching for: ${query}`,
            duration: 5000,
          });
        } catch (error) {
          console.error('Image analysis failed:', error);
          
          sonnerToast.error('Image analysis failed', {
            id: 'image-analysis',
            description: error instanceof Error ? error.message : 'Failed to analyze image',
          });
          
          const fileName = data.value.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          query = fileName.length > 3 ? fileName : "Unidentified product";
          
          sonnerToast.info('Using filename as search term', {
            description: `Searching for: ${query}`,
          });
        }
      } else if (data.type === 'url' && typeof data.value === 'string') {
        try {
          const parsedUrl = new URL(data.value);
          const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment.length > 0);
          let extractedQuery = '';
          
          if (pathSegments.length > 0) {
            extractedQuery = pathSegments[pathSegments.length - 1]
              .replace(/[-_]/g, ' ')
              .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
          }
          
          if (!extractedQuery || extractedQuery.length < 3) {
            const domainParts = parsedUrl.hostname.split('.');
            extractedQuery = domainParts[0] !== 'www' ? domainParts[0] : 'product';
          }
          
          query = extractedQuery;
        } catch (error) {
          console.error('URL parsing error:', error);
          query = data.value.substring(0, 50);
        }
      }
      
      if (!query || query.trim().length < 2) {
        query = "Unidentified product";
      }
      
      setSearchTerm(query);
      
      sonnerToast.loading('Searching for the best value...', {
        id: 'search',
        duration: 12000,
      });
      
      console.log('Starting product search for query:', query);
      
      const startTime = performance.now();
      
      try {
        const response = await searchProducts({ query });
        
        const endTime = performance.now();
        console.log(`Search completed in ${(endTime - startTime).toFixed(0)}ms, status:`, response.search_metadata.status);
        
        if (response.search_metadata.status === 'Success (Mock)') {
          setIsMockData(true);
          sonnerToast.info('Using demo data', {
            id: 'search',
            description: 'Due to API limitations, we\'re showing sample results',
            duration: 5000,
          });
        } else {
          sonnerToast.success('Search completed', {
            id: 'search',
            description: `Found ${response.shopping_results.length} results`,
            duration: 5000,
          });
        }
        
        if (response.shopping_results && response.shopping_results.length > 0) {
          setSearchResults(response.shopping_results);
          
          if (query) {
            addToSearchHistory(query, data.type);
          }
          
          navigate('/results');
        } else {
          sonnerToast.error('No results found', {
            id: 'search',
            description: 'Please try a different search query',
            duration: 5000,
          });
          
          toast({
            title: "No Results",
            description: "We couldn't find any products matching your search.",
            variant: "destructive"
          });
          
          const mockResponse = await searchProducts({ 
            query: "popular products"
          });
          
          setIsMockData(true);
          setSearchResults(mockResponse.shopping_results);
          navigate('/results');
        }
      } catch (error) {
        console.error('Product search error:', error);
        
        sonnerToast.error('Search failed', {
          id: 'search',
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
          duration: 5000,
        });
        
        toast({
          title: "Search Failed",
          description: "We encountered an error. Showing sample results instead.",
          variant: "destructive"
        });
        
        setIsMockData(true);
        const mockResponse = await searchProducts({ 
          query: typeof data.value === 'string' ? data.value.substring(0, 50) : 'sample product'
        });
        
        if (mockResponse.shopping_results && mockResponse.shopping_results.length > 0) {
          setSearchResults(mockResponse.shopping_results);
          navigate('/results');
        }
      }
      
    } catch (error) {
      console.error('Overall search process error:', error);
      
      sonnerToast.error('Search process failed', {
        description: 'An unexpected error occurred. Showing sample results instead.',
        duration: 5000,
      });
      
      setIsMockData(true);
      const mockResponse = await searchProducts({ query: 'popular products' });
      setSearchResults(mockResponse.shopping_results);
      navigate('/results');
      
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
    setIsMockData(false);
  };

  return (
    <SearchContext.Provider value={{
      searchTerm,
      searchType,
      isSearching,
      searchResults,
      performSearch,
      clearSearch,
      isMockData
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
