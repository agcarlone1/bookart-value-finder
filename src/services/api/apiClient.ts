
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
    
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      // Try to get error details, but handle the case where response might be empty
      let errorMessage = `Failed to fetch search results (${response.status})`;
      let responseText = '';
      
      try {
        // Get the raw response text first
        responseText = await response.text();
        console.log('Raw error response:', responseText);
        
        // Only try to parse it as JSON if it's not empty and looks like JSON
        if (responseText && (responseText.startsWith('{') || responseText.startsWith('['))) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } else {
          // If it's not JSON, use the raw text if available
          errorMessage = responseText || errorMessage;
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        // Use the raw response text if JSON parsing failed
        errorMessage = responseText || errorMessage;
      }
      
      console.error('API error response:', errorMessage);
      throw new Error(errorMessage);
    }

    // Check if the response has content before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const rawText = await response.text();
      console.log('Unexpected response format:', rawText);
      throw new Error('API response is not JSON');
    }
    
    // Now we can safely parse the JSON
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
