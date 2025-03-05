
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
        query = await extractSearchQueryFromImage(data.value);
      } else if (data.type === 'url' && typeof data.value === 'string') {
        // For URL, we'll just use the last part of the URL as a simple mock
        // In a real app, you would fetch the URL and analyze its contents
        const urlParts = data.value.split('/');
        query = urlParts[urlParts.length - 1].replace(/[-_]/g, ' ');
        if (!query) query = data.value;
      }
      
      setSearchTerm(query);
      
      // Perform the actual search
      const response = await searchProducts({ query });
      
      if (response.error) {
        toast({
          title: "Search Error",
          description: response.error,
          variant: "destructive"
        });
        return;
      }
      
      setSearchResults(response.shopping_results);
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
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
