
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SearchBannerProps {
  searchTerm: string;
  productCount: number;
  isMockData: boolean;
}

const SearchBanner = ({ searchTerm, productCount, isMockData }: SearchBannerProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-4 animate-slide-down">
        <Button 
          variant="ghost" 
          className="mb-2 text-sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Search
        </Button>
        
        <h1 className="text-xl md:text-2xl font-bold mb-1">Search Results</h1>
        <p className="text-muted-foreground text-sm">
          {searchTerm ? (
            <>We found {productCount} matching items for <span className="font-medium">"{searchTerm}"</span></>
          ) : (
            "Searching for products..."
          )}
        </p>
      </div>
      
      {isMockData && (
        <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Using demo data due to API limitations. In a production environment, you would see real product data.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SearchBanner;
