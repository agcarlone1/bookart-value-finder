
import React from 'react';
import { Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface UrlInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({ className, ...props }) => {
  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="flex items-center justify-center">
        <Link size={24} className="text-muted-foreground" />
      </div>
      
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-sm font-medium">Paste product URL</h3>
        <p className="text-xs text-muted-foreground">
          Enter a link to the product you want to find the best value for
        </p>
      </div>
      
      <div className="relative">
        <Input
          type="url"
          placeholder="https://www.example.com/product"
          className={cn(
            "pl-10 py-6 rounded-lg border-input focus:border-primary transition-all duration-300",
            className
          )}
          {...props}
        />
        <Link 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
      </div>
    </div>
  );
};

export default UrlInput;
