
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { searchProducts, extractSearchQueryFromImage } from '@/services/serpApiService';

type SearchType = 'image' | 'url';

interface SearchContextType {
  searchTerm: string;
  searchType: SearchType;
  isSearching: boolean;
  searchResults: any[] | null;
  performSearch: (data: { type: SearchType, value: string | File }) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('image');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const performSearch = async (data: { type: SearchType, value: string | File }) => {
    try {
      setIsSearching(true);
      setSearchType(data.type);
      
      let query = '';
      
      // Handle different search types
      if (data.type === 'image' && data.value instanceof File) {
        sonnerToast.loading('Analyzing image...', {
          id: 'image-analysis',
        });
        
        query = await extractSearchQueryFromImage(data.value);
        
        sonnerToast.success('Image analyzed', {
          id: 'image-analysis',
          description: `Searching for: ${query}`,
        });
      } else if (data.type === 'url' && typeof data.value === 'string') {
        // For URL, we'll just use the last part of the URL as a simple query
        const urlParts = data.value.split('/');
        query = urlParts[urlParts.length - 1].replace(/[-_]/g, ' ');
        if (!query) query = data.value;
      }
      
      setSearchTerm(query);
      
      sonnerToast.loading('Searching for the best value...', {
        id: 'search',
        duration: 10000,
      });
      
      // Perform the actual search
      const response = await searchProducts({ query });
      
      if (response.error) {
        console.error("Search error from API:", response.error);
        
        sonnerToast.error('Search failed', {
          id: 'search',
          description: response.error,
        });
        
        toast({
          title: "Search Error",
          description: response.error,
          variant: "destructive"
        });
        
        // If we got mock data despite an error, we can still show results
        if (response.shopping_results && response.shopping_results.length > 0) {
          sonnerToast.info('Using demo data', {
            description: 'Due to API limitations, we\'re showing sample results',
          });
          
          setSearchResults(response.shopping_results);
          navigate('/results');
        }
        
        return;
      }
      
      // Success case
      sonnerToast.success('Search completed', {
        id: 'search',
        description: `Found ${response.shopping_results.length} results`,
      });
      
      setSearchResults(response.shopping_results);
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Search error:', error);
      
      sonnerToast.error('Search failed', {
        id: 'search',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      
      toast({
        title: "Search Failed",
        description: "We encountered a network error. Switching to demo mode.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };

  return (
    <SearchContext.Provider value={{
      searchTerm,
      searchType,
      isSearching,
      searchResults,
      performSearch,
      clearSearch
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
