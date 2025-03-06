
import { ShoppingResult } from '@/services/api/types';

export type SearchType = 'text' | 'image' | 'url';

export interface SearchContextType {
  searchTerm: string;
  searchResults: ShoppingResult[] | null;
  isSearching: boolean;
  isMockData: boolean;
  performSearch: (searchOptions: { type: SearchType, value: string | File }) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: ShoppingResult[]) => void;
  setIsMockData: (isMock: boolean) => void;
}
