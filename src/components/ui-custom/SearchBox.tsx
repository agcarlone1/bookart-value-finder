
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, Upload, Link, ArrowRight, AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import UrlInput from './UrlInput';
import { useSearch } from '@/contexts/search';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SearchBoxProps {
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'url'>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const { performSearch, isSearching, error } = useSearch();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if ((activeTab === 'image' && imageFile) || (activeTab === 'url' && url)) {
      performSearch({ 
        type: activeTab, 
        value: activeTab === 'image' ? (imageFile as File) : url 
      });
    }
  };

  return (
    <div className={cn(
      'w-full max-w-2xl mx-auto rounded-2xl bg-white shadow-light-lg p-6 transition-all duration-300 animate-scale-in',
      className
    )}>
      <div className="flex items-center justify-center mb-6 gap-4">
        <Button
          type="button"
          variant={activeTab === 'image' ? 'default' : 'outline'}
          className={cn(
            'flex-1 rounded-lg text-sm font-medium py-2 transition-all duration-300',
            activeTab === 'image' ? 'shadow-md' : 'shadow-none'
          )}
          onClick={() => setActiveTab('image')}
        >
          <Upload size={16} className="mr-2" />
          Upload Image
        </Button>
        
        <Button
          type="button"
          variant={activeTab === 'url' ? 'default' : 'outline'}
          className={cn(
            'flex-1 rounded-lg text-sm font-medium py-2 transition-all duration-300',
            activeTab === 'url' ? 'shadow-md' : 'shadow-none'
          )}
          onClick={() => setActiveTab('url')}
        >
          <Link size={16} className="mr-2" />
          Paste URL
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <div className="text-xs mt-1">
              Note: For this demo to work correctly, use the simulated data option or start the Express server with: <code className="bg-gray-100 px-1 rounded">node server/index.js</code>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="min-h-[200px] flex items-center justify-center">
          {activeTab === 'image' ? (
            <ImageUploader 
              onFileSelected={setImageFile} 
              selectedFile={imageFile}
            />
          ) : (
            <UrlInput 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              onEnterPress={handleSubmit}
            />
          )}
        </div>
        
        <Button 
          type="submit"
          className="w-full py-6 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300 animate-fade-in"
          disabled={
            isSearching || 
            (activeTab === 'image' && !imageFile) || 
            (activeTab === 'url' && !url)
          }
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-white/50 rounded-full border-t-white"></div>
              <span>Searching...</span>
            </div>
          ) : (
            <>
              <Search size={18} />
              <span>Find Best Value</span>
              <ArrowRight size={18} className="ml-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default SearchBox;
