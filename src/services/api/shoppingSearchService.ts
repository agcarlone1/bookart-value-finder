import { 
  API_KEY, 
  API_BASE_URL, 
  createTimeout, 
  getRequestOptions, 
  getApiUrl, 
  getCurrentProxy,
  IS_DEVELOPMENT,
  USE_MOCK_DATA_ONLY,
  getBookSearchParams,
  getGeneralSearchParams
} from './apiConfig';
import { SerpApiResponse, SearchOptions } from './types';

export const searchProducts = async ({ 
  query, 
  limit = 10, 
  _proxyUrl,
  isBook = false
}: SearchOptions & { _proxyUrl?: string }): Promise<SerpApiResponse> => {
  try {
    console.log('Fetching from SerpAPI with query:', query, isBook ? '(book search)' : '');
    
    // If we're explicitly set to only use mock data, return it immediately
    if (USE_MOCK_DATA_ONLY && IS_DEVELOPMENT) {
      console.log('Using mock data by configuration (USE_MOCK_DATA_ONLY)');
      return getMockData(query, 'Mock data used by configuration');
    }
    
    // Parameters for the SerpAPI request - use book-specific parameters if indicated
    const params = isBook || query.toLowerCase().includes('book') || query.toLowerCase().includes('author')
      ? getBookSearchParams(query)
      : getGeneralSearchParams(query);
    
    // Get the final URL with proxy
    const proxyUrlToUse = _proxyUrl || (window as any).temporaryProxyOverride || getCurrentProxy();
    const finalUrl = getApiUrl('search.json', params);
    
    console.log('Request URL:', finalUrl);
    console.log('Using proxy:', proxyUrlToUse);
    
    // Increase the timeout to 30 seconds
    const timeout = createTimeout(30000);
    
    try {
      const requestOptions = getRequestOptions(timeout.signal, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      console.log('Request options:', JSON.stringify(requestOptions));
      
      const response = await fetch(finalUrl, requestOptions);
      
      timeout.clear();
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SerpAPI error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('SerpAPI response received:', data);
      
      // Check if we received an error from SerpAPI
      if (data.error) {
        console.error('SerpAPI error:', data.error);
        throw new Error(data.error);
      }
      
      // If there are no shopping results, throw an error
      if (!data.shopping_results || data.shopping_results.length === 0) {
        console.error('No shopping results found');
        throw new Error('No shopping results found');
      }
      
      // Limit the results if requested
      if (data.shopping_results && limit) {
        data.shopping_results = data.shopping_results.slice(0, limit);
      }
      
      return data;
    } catch (error) {
      timeout.clear();
      
      console.error('Fetch error details:', error);
      throw error; // Rethrow to be caught by the outer try/catch
    }
    
  } catch (error) {
    console.error("Error fetching from SerpAPI:", error);
    
    // Only use mock data if in development
    if (IS_DEVELOPMENT && shouldReturnMockData(error)) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Using mock data due to: ${errorMessage}`);
      return getMockData(query, errorMessage, isBook);
    }
    
    // Otherwise, throw the error
    throw error;
  }
};

// Function to determine if mock data should be returned
function shouldReturnMockData(error: unknown): boolean {
  // In production, we should never use mock data unless explicitly configured to do so
  if (!IS_DEVELOPMENT) {
    return false;
  }
  
  if (error instanceof Error) {
    // Check for common network errors that suggest we should use mock data
    return error.message.includes('Failed to fetch') || 
           error.message.includes('Network Error') ||
           error.message.includes('CORS') ||
           error.message.includes('AbortError') ||
           error.message.includes('quota exceeded');
  }
  return false; // Default to not using mock data for unknown errors
}

// Update the SearchOptions type to accept the proxy parameter
declare module './types' {
  interface SearchOptions {
    _proxyUrl?: string;
    isBook?: boolean;
  }
}

// Mock data for testing or when API fails
export function getMockData(query: string, errorMessage: string, isBook = false): SerpApiResponse {
  console.log("Using mock data due to error:", errorMessage);
  
  // Book-specific mock data
  if (isBook || query.toLowerCase().includes('book') || query.toLowerCase().includes('author')) {
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
        },
        {
          position: 4,
          title: `${query} - Illustrated Edition`,
          link: "https://example.com/book4",
          source: "Books-A-Million",
          price: "$19.99",
          extracted_price: 19.99,
          thumbnail: "https://picsum.photos/200/303",
          delivery: "$2.99 shipping"
        },
        {
          position: 5,
          title: `${query} - Audio Book`,
          link: "https://example.com/book5",
          source: "Audible",
          price: "$15.99",
          extracted_price: 15.99,
          thumbnail: "https://picsum.photos/200/304",
          delivery: "Digital Download"
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
      },
      {
        position: 4,
        title: `${query} - Budget Option (Mock Data)`,
        link: "https://example.com/product4",
        source: "Discount Store",
        price: "$19.99",
        extracted_price: 19.99,
        thumbnail: "https://picsum.photos/200/303",
        delivery: "$2.99 shipping"
      },
      {
        position: 5,
        title: `${query} - Limited Edition (Mock Data)`,
        link: "https://example.com/product5",
        source: "Collector's Market",
        price: "$149.99",
        extracted_price: 149.99,
        thumbnail: "https://picsum.photos/200/304",
        delivery: "Free shipping"
      }
    ]
  };
}
