
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
    // Make sure we're using the correct endpoint path
    const endpoint = `${API_URL}/google-lens`;
    console.log('Sending request to backend API:', endpoint);
    console.log('Request payload:', { imageUrl: imageUrl.substring(0, 50) + '...' });
    
    // Create a mock response when running in development without a server
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      console.log('Using mock data as server is not running');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      return {
        search_metadata: {
          id: 'mock-id-123',
          status: 'Success',
          json_endpoint: '',
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          google_url: 'https://www.google.com/search?q=book+cover',
          raw_html_file: '',
          total_time_taken: 0.5
        },
        search_parameters: {
          engine: 'google_lens_exact_matches'
        },
        exact_matches: [
          {
            position: 1,
            title: "Rich Dad Poor Dad - 20th Anniversary Edition",
            link: "https://www.amazon.com/Rich-Dad-Poor-Teach-Middle/dp/1612680194",
            source: "Amazon.com",
            price: "$8.48",
            extracted_price: 8.48,
            thumbnail: "https://m.media-amazon.com/images/I/91VokXkn8hL._AC_UF1000,1000_QL80_.jpg",
            delivery: "Free delivery",
            rating: 4.7,
            reviews: 472
          },
          {
            position: 2,
            title: "Rich Dad Poor Dad: What the Rich Teach Their Kids About Money",
            link: "https://www.barnesandnoble.com/w/rich-dad-poor-dad-robert-t-kiyosaki/1100262400",
            source: "Barnes & Noble",
            price: "$9.99",
            extracted_price: 9.99,
            thumbnail: "https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg",
            delivery: "Free shipping with $35 purchase",
            rating: 4.6,
            reviews: 289
          },
          {
            position: 3,
            title: "Rich Dad Poor Dad (Paperback)",
            link: "https://www.walmart.com/ip/Rich-Dad-Poor-Dad-What-the-Rich-Teach-Their-Kids-About-Money-That-the-Poor-and-Middle-Class-Do-Not-Paperback-9781612680194/55559580",
            source: "Walmart",
            price: "$7.64",
            extracted_price: 7.64,
            thumbnail: "https://i5.walmartimages.com/asr/7049a635-dabe-4ac8-be5e-bb667eb325b0.69e388a3a051ac6d421be092b541e2b0.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
            delivery: "2-day delivery",
            rating: 4.5,
            reviews: 196
          }
        ]
      };
    }
    
    // Real API request code
    const response = await fetch(endpoint, {
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
      
      if (response.status === 404) {
        throw new Error(`Endpoint ${endpoint} not found (404). Please make sure your backend server is running and the route is correctly defined.`);
      }
      
      throw new Error(errorMessage);
    }

    // Check if the response has content before parsing
    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);
    
    // Always log the raw response first for debugging
    const rawText = await response.text();
    console.log('Raw successful response:', rawText.substring(0, 200) + (rawText.length > 200 ? '...' : ''));
    
    if (!rawText || rawText.trim() === '') {
      throw new Error('API returned an empty response');
    }
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log('Unexpected response format:', rawText);
      throw new Error('API response is not JSON');
    }
    
    // Now we can safely parse the JSON
    const data = JSON.parse(rawText);
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
