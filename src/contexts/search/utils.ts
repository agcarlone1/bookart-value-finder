import { SearchType } from './types';
import { toast as sonnerToast } from 'sonner';
import { extractSearchQueryFromImage } from '@/services/api';

export const processImageSearch = async (imageFile: File): Promise<string> => {
  sonnerToast.loading('Analyzing image with Google Lens...', {
    id: 'image-analysis',
    duration: 15000,
  });
  
  console.log('Starting image analysis with file:', imageFile.name, 'size:', imageFile.size);
  
  try {
    const query = await extractSearchQueryFromImage(imageFile);
    
    sonnerToast.success('Image analyzed', {
      id: 'image-analysis',
      description: `Searching for: ${query}`,
      duration: 5000,
    });
    
    return query;
  } catch (error) {
    console.error('Image analysis failed:', error);
    
    sonnerToast.error('Image analysis failed', {
      id: 'image-analysis',
      description: error instanceof Error ? error.message : 'Failed to analyze image',
    });
    
    const fileName = imageFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    
    if (fileName.toLowerCase().includes('book') || 
        fileName.toLowerCase().includes('novel') || 
        fileName.toLowerCase().includes('author')) {
      return fileName + " book";
    }
    
    return fileName.length > 3 ? fileName : "Photography book";
  }
};

export const processUrlSearch = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment.length > 0);
    let extractedQuery = '';
    
    if (pathSegments.length > 0) {
      extractedQuery = pathSegments[pathSegments.length - 1]
        .replace(/[-_]/g, ' ')
        .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    }
    
    if (!extractedQuery || extractedQuery.length < 3) {
      const domainParts = parsedUrl.hostname.split('.');
      extractedQuery = domainParts[0] !== 'www' ? domainParts[0] : 'product';
    }
    
    return extractedQuery;
  } catch (error) {
    console.error('URL parsing error:', error);
    return url.substring(0, 50);
  }
};

export const handleSearchError = async (error: any, value: string | File): Promise<any> => {
  console.error('Product search error:', error);
  
  sonnerToast.error('Search failed', {
    id: 'search',
    description: error instanceof Error ? error.message : 'An unexpected error occurred',
    duration: 5000,
  });
  
  const searchQuery = typeof value === 'string' ? value.substring(0, 50) : 'sample product';
  return { searchQuery, useMockData: true };
};
