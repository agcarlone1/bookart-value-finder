
import React from 'react';
import { Search } from 'lucide-react';

const NoResultsMessage = () => {
  return (
    <div className="py-12 text-center text-muted-foreground col-span-full">
      <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <p>No products found. Please try another search.</p>
    </div>
  );
};

export default NoResultsMessage;
