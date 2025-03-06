
import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/contexts/wishlist';
import { SearchHistoryItem } from '@/contexts/wishlist';
import { useSearch } from '@/contexts/SearchContext';
import { format } from 'date-fns';

const SearchHistoryList = ({
  onClearHistory
}: {
  onClearHistory: () => void;
}) => {
  const navigate = useNavigate();
  const { searchHistory } = useWishlist();
  const { performSearch } = useSearch();
  
  const handleSearchAgain = (historyItem: SearchHistoryItem) => {
    // This is a simplified implementation since we can't actually reproduce image searches
    // In a real app, you might store the image URL or other data needed to reproduce the search
    performSearch({
      type: 'url',
      value: historyItem.searchTerm
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <History size={18} className="text-primary" />
          <span className="text-lg font-medium">
            {searchHistory.length} Search {searchHistory.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>
        
        {searchHistory.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearHistory}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <Trash2 size={14} className="mr-1" />
            Clear History
          </Button>
        )}
      </div>
      
      {searchHistory.length > 0 ? (
        <div className="space-y-2 animate-slide-up">
          {searchHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border hover:shadow-light-sm transition-all">
              <div className="flex flex-col">
                <div className="font-medium">{item.searchTerm}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="capitalize">{item.searchType} search</span>
                  <span>•</span>
                  <span>{format(new Date(item.timestamp), 'MMM d, yyyy - h:mm a')}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSearchAgain(item)}
              >
                Search Again
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Your search history is empty. Start searching to build history.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Start Searching
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchHistoryList;
