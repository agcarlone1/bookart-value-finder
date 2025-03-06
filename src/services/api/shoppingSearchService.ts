
import { 
  API_KEY, 
  getApiUrl, 
  createTimeout, 
  getRequestOptions,
  IS_DEVELOPMENT,
  USE_MOCK_DATA,
  getBookSearchParams,
  getGeneralSearchParams
} from './apiConfig';
import { SerpApiResponse, SearchOptions } from './types';

export const searchProducts = async ({ 
  query, 
  limit = 10,
  isBook = false
}: SearchOptions): Promise<SerpApiResponse> => {
  try {
    console.log('Fetching from SerpAPI with query:', query);
    
    // Check if we should use mock data
    if (USE_MOCK_DATA && IS_DEVELOPMENT) {
      console.log('Using mock data by configuration');
      return getMockData(query, 'Mock data used by configuration', isBook);
    }
    
    // Use appropriate parameters based on query type
    const params = isBook || query.toLowerCase().includes('book') 
      ? getBookSearchParams(query)
      : getGeneralSearchParams(query);
    
    // Get the API URL with proxy if enabled
    const finalUrl = getApiUrl('search.json', params);
    console.log('Request URL:', finalUrl);
    
    // Set up request with timeout
    const timeout = createTimeout(30000); // 30 second timeout
    const requestOptions = getRequestOptions(timeout.signal);
    
    const response = await fetch(finalUrl, requestOptions);
    timeout.clear();
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpAPI error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check for API-level errors
    if (data.error) {
      console.error('SerpAPI error:', data.error);
      throw new Error(data.error);
    }
    
    // Check for missing results
    if (!data.shopping_results || data.shopping_results.length === 0) {
      console.error('No shopping results found');
      throw new Error('No shopping results found');
    }
    
    // Limit results if requested
    if (limit && data.shopping_results) {
      data.shopping_results = data.shopping_results.slice(0, limit);
    }
    
    return data;
    
  } catch (error) {
    console.error("Error fetching from SerpAPI:", error);
    
    // Use mock data in development or when there's an error
    if (IS_DEVELOPMENT) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Using mock data due to error: ${errorMessage}`);
      return getMockData(query, errorMessage, isBook);
    }
    
    throw error;
  }
};

// Generate mock data for development and error cases
export function getMockData(query: string, reason: string, isBook = false): SerpApiResponse {
  console.log("Using mock data because:", reason);
  
  // Book-specific mock data
  if (isBook || query.toLowerCase().includes('book')) {
    return {
      search_metadata: {
        id: 'mock-book-id',
        status: 'Success (Mock)',
        json_endpoint: '',
        created_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        google_url: '',
        raw_html_file: '',
        total_time_taken: 0
      },
      search_parameters: {
        engine: 'google_shopping',
        q: query,
        google_domain: 'google.com',
        gl: 'us',
        hl: 'en'
      },
      shopping_results: [
        {
          position: 1,
          title: `${query} - First Edition`,
          link: "https://example.com/book1",
          source: "Book Depository",
          price: "$21.99",
          extracted_price: 21.99,
          thumbnail: "https://picsum.photos/200/300",
          delivery: "Free shipping"
        },
        {
          position: 2,
          title: `${query} - Paperback`,
          link: "https://example.com/book2",
          source: "Barnes & Noble",
          price: "$14.95",
          extracted_price: 14.95,
          thumbnail: "https://picsum.photos/200/301",
          delivery: "Free shipping"
        },
        {
          position: 3,
          title: `${query} - Hardcover Special Edition`,
          link: "https://example.com/book3",
          source: "Amazon",
          price: "$29.99",
          extracted_price: 29.99,
          thumbnail: "https://picsum.photos/200/302",
          delivery: "$4.99 shipping"
        }
      ]
    };
  }
  
  // General mock data for non-book items
  return {
    search_metadata: {
      id: 'mock-id',
      status: 'Success (Mock)',
      json_endpoint: '',
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString(),
      google_url: '',
      raw_html_file: '',
      total_time_taken: 0
    },
    search_parameters: {
      engine: 'google_shopping',
      q: query,
      google_domain: 'google.com',
      gl: 'us',
      hl: 'en'
    },
    shopping_results: [
      {
        position: 1,
        title: `${query} - Premium Collection (Mock Data)`,
        link: "https://example.com/product1",
        source: "Example Store",
        price: "$24.99",
        extracted_price: 24.99,
        thumbnail: "https://picsum.photos/200/300",
        delivery: "Free shipping"
      },
      {
        position: 2,
        title: `${query} - Deluxe Set (Mock Data)`,
        link: "https://example.com/product2",
        source: "Book Store",
        price: "$34.99",
        extracted_price: 34.99,
        thumbnail: "https://picsum.photos/200/301",
        delivery: "Free shipping"
      },
      {
        position: 3,
        title: `${query} - Special Edition (Mock Data)`,
        link: "https://example.com/product3",
        source: "Vintage Shop",
        price: "$129.99",
        extracted_price: 129.99,
        thumbnail: "https://picsum.photos/200/302",
        delivery: "$4.99 shipping"
      }
    ]
  };
}
