
export type SearchType = 'image' | 'url';

export interface SearchContextType {
  searchTerm: string;
  searchType: SearchType;
  isSearching: boolean;
  searchResults: any[] | null;
  performSearch: (data: { type: SearchType, value: string | File }) => Promise<void>;
  clearSearch: () => void;
  isMockData: boolean;
}

export interface SearchData {
  type: SearchType;
  value: string | File;
}
