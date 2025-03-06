
import { GoogleLensRequest, LensApiResponse } from './types';

// Get the API URL from environment variables or use a fallback
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Client-side function to call the server-side Google Lens API
 * This avoids CORS issues by proxying the request through our server
 */
export const fetchImageSearchResults = async (
  imageUrl: string
): Promise<LensApiResponse> => {
  try {
    console.log('Sending request to backend API:', `${API_URL}/google-lens`);
    console.log('Request payload:', { imageUrl: imageUrl.substring(0, 50) + '...' });
    
    const response = await fetch(`${API_URL}/google-lens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.message || `Failed to fetch search results (${response.status})`);
    }

    const data = await response.json();
    console.log('API response received successfully', { 
      metadata: data.search_metadata,
      exactMatchesCount: data.exact_matches?.length || 0 
    });
    
    return data;
  } catch (error) {
    console.error('Error in client-side image search:', error);
    return {
      search_metadata: {
        id: '',
        status: 'Error',
        json_endpoint: '',
        created_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        google_url: '',
        raw_html_file: '',
        total_time_taken: 0
      },
      search_parameters: {
        engine: 'google_lens_exact_matches'
      },
      error: error instanceof Error ? error.message : 'Failed to fetch image search results. Please try again later.',
    };
  }
};
