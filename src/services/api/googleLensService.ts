
import { API_KEY, API_BASE_URL } from './apiConfig';
import { LensApiResponse } from './types';

// This function should run server-side to avoid CORS issues
export const fetchGoogleLensResults = async (imageUrl: string): Promise<LensApiResponse> => {
  try {
    const url = new URL(`${API_BASE_URL}/search`);
    
    // Add parameters
    url.searchParams.append('engine', 'google_lens_exact_matches');
    url.searchParams.append('url', imageUrl);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('gl', 'us');
    url.searchParams.append('hl', 'en');
    
    console.log('Server: Making request to SERPAPI with params:', {
      engine: 'google_lens_exact_matches',
      url: imageUrl.substring(0, 50) + '...',
      api_key: API_KEY.substring(0, 5) + '...',
      gl: 'us',
      hl: 'en'
    });
    
    console.log('Server: Full SERPAPI URL:', url.toString().replace(API_KEY, 'API_KEY_REDACTED'));
    
    // Make the request from the server side
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Server: SERPAPI response status:', response.status, response.statusText);
    
    // Always log the raw response first for debugging
    const rawResponse = await response.text();
    console.log('Server: SERPAPI raw response (first 200 chars):', 
      rawResponse.substring(0, 200) + (rawResponse.length > 200 ? '...' : ''));
    
    if (!response.ok) {
      console.error('Server: SERPAPI request failed. Raw response:', rawResponse);
      
      let errorMessage = `SERPAPI request failed: ${response.status}`;
      
      // Try to parse as JSON if it looks like JSON
      if (rawResponse && (rawResponse.startsWith('{') || rawResponse.startsWith('['))) {
        try {
          const errorData = JSON.parse(rawResponse);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // Use raw text if JSON parsing fails
          errorMessage = rawResponse || errorMessage;
        }
      } else if (rawResponse) {
        // If not JSON, use the raw text
        errorMessage = rawResponse;
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if there's content
    if (!rawResponse || rawResponse.trim() === '') {
      throw new Error('SERPAPI returned an empty response');
    }
    
    // Now parse as JSON
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error('Server: Failed to parse SERPAPI response as JSON:', parseError);
      throw new Error(`Invalid JSON response from SERPAPI: ${rawResponse.substring(0, 100)}...`);
    }
    
    console.log('Server: SERPAPI response received successfully', {
      id: data.search_metadata?.id,
      status: data.search_metadata?.status,
      exactMatchesCount: data.exact_matches?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error('Server: Error fetching Google Lens results:', error);
    
    // Return user-friendly error
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
      error: error instanceof Error ? error.message : 'Failed to fetch Google Lens results. Please try again later.',
    };
  }
};

// Create an Express.js route handler or serverless function
// This would be implemented in your backend server code
export const handleGoogleLensRequest = async (req, res) => {
  try {
    console.log('Server: Lens API request received');
    console.log('Server: Request headers:', req.headers);
    console.log('Server: Request body:', req.body);
    
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      console.error('Server: Missing imageUrl in request body');
      return res.status(400).json({ 
        error: 'Missing imageUrl in request body' 
      });
    }
    
    console.log('Server: Processing Lens API request with imageUrl', 
      imageUrl.substring(0, 30) + '...');
    
    const results = await fetchGoogleLensResults(imageUrl);
    
    // If there was an error in the SERPAPI request
    if (results.error) {
      console.error('Server: Error in SERPAPI response:', results.error);
      return res.status(500).json({ 
        error: results.error,
        message: 'Failed to fetch results from SERPAPI'
      });
    }
    
    console.log('Server: Successfully processed Lens API request, sending response');
    return res.status(200).json(results);
  } catch (error) {
    console.error('Server: Error in Google Lens API handler:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
};
