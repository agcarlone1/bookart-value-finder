
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, Upload, Link, ArrowRight } from 'lucide-react';
import ImageUploader from './ImageUploader';
import UrlInput from './UrlInput';

interface SearchBoxProps {
  className?: string;
  onSubmit?: (data: { type: 'image' | 'url', value: string | File }) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ className, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'url'>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((activeTab === 'image' && imageFile) || (activeTab === 'url' && url)) {
      setIsSubmitting(true);
      
      // This is where we would call the API
      onSubmit?.({ 
        type: activeTab, 
        value: activeTab === 'image' ? (imageFile as File) : url 
      });
      
      // In a real app, this would be handled in the onSubmit callback
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
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
            />
          )}
        </div>
        
        <Button 
          type="submit"
          className="w-full py-6 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300 animate-fade-in"
          disabled={
            isSubmitting || 
            (activeTab === 'image' && !imageFile) || 
            (activeTab === 'url' && !url)
          }
        >
          {isSubmitting ? (
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
