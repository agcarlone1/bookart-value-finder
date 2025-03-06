
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface TestApiButtonProps {
  onTest: () => void;
  isLoading: boolean;
}

const TestApiButton = ({ onTest, isLoading }: TestApiButtonProps) => {
  return (
    <Button 
      onClick={onTest}
      disabled={isLoading}
      className="flex-1"
    >
      {isLoading ? (
        <>
          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          Testing API...
        </>
      ) : (
        'Test SerpAPI Connection'
      )}
    </Button>
  );
};

export default TestApiButton;
