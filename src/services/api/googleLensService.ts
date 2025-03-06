
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
    
    // Make the request from the server side
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SERPAPI request failed: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Google Lens results:', error);
    
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
export const handleGoogleLensRequest = async (req: any, res: any) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Missing imageUrl in request body' 
      });
    }
    
    const results = await fetchGoogleLensResults(imageUrl);
    
    // If there was an error in the SERPAPI request
    if (results.error) {
      return res.status(500).json({ 
        error: results.error,
        message: 'Failed to fetch results from SERPAPI'
      });
    }
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in Google Lens API handler:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
};
