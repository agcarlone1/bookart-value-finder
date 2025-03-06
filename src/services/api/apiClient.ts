
import { GoogleLensRequest, LensApiResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Client-side function to call the server-side Google Lens API
 * This avoids CORS issues by proxying the request through our server
 */
export const fetchImageSearchResults = async (
  imageUrl: string
): Promise<LensApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/google-lens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch search results');
    }

    return await response.json();
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
