
import { mockSearchResults } from './mockData';

// Client-side function to call our server endpoint for image search
export const fetchImageSearchResults = async (imageUrl: string) => {
  try {
    console.log("Simulating server call with image URL");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Using mock data for image search results");
    
    // Return mock data with a successful response
    return {
      success: true,
      search_metadata: {
        id: 'mock-lens-id',
        status: 'Success (Mock)',
        json_endpoint: '',
        created_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        google_url: '',
        raw_html_file: '',
        total_time_taken: 0
      },
      search_parameters: {
        engine: 'google_lens_exact_matches',
        url: imageUrl.substring(0, 20) + '...',
      },
      exact_matches: mockSearchResults.map((item, index) => ({
        ...item,
        title: `Image Search Result ${index + 1}`,
      }))
    };
  } catch (error) {
    console.error("Error in client-side image search:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in image search',
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
      }
    };
  }
};
