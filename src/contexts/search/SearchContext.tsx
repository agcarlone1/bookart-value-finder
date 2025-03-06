
import React, { createContext, useContext } from 'react';
import { SearchContextType } from './types';
import { useSearchProvider } from './useSearchProvider';

// This is used for type checking only
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
