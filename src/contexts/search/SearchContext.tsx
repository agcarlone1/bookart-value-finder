
import React, { createContext, useContext } from 'react';
import { SearchContextType } from './types';
import { useSearchProvider } from './useSearchProvider';

// Create a context with undefined as the default value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pass an empty object as children to fix the typing issue
  const searchState = useSearchProvider({ children });
  
  return (
    <SearchContext.Provider value={searchState as unknown as SearchContextType}>
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
