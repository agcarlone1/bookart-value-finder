
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { searchProducts } from '@/services/api';
import { useWishlist } from '../WishlistContext';
import { SearchType, SearchData } from './types';
import { processImageSearch, processUrlSearch, handleSearchError } from './utils';

export const useSearchProvider = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('image');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isMockData, setIsMockData] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToSearchHistory } = useWishlist();

  const performSearch = async (data: SearchData) => {
    try {
      setIsSearching(true);
      setSearchType(data.type);
      setIsMockData(false);
      
      let query = '';
      
      if (data.type === 'image' && data.value instanceof File) {
        query = await processImageSearch(data.value);
      } else if (data.type === 'url' && typeof data.value === 'string') {
        query = processUrlSearch(data.value);
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
        const { searchQuery, useMockData } = await handleSearchError(error, data.value);
        
        toast({
          title: "Search Failed",
          description: "We encountered an error. Showing sample results instead.",
          variant: "destructive"
        });
        
        setIsMockData(useMockData);
        const mockResponse = await searchProducts({ query: searchQuery });
        
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

  return {
    searchTerm,
    searchType,
    isSearching,
    searchResults,
    performSearch,
    clearSearch,
    isMockData
  };
};
