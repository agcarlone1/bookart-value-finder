
import { API_KEY, API_BASE_URL, createTimeout, getRequestOptions } from './apiConfig';
import { SerpApiResponse, SearchOptions } from './types';

export const searchProducts = async ({ query, limit = 10 }: SearchOptions): Promise<SerpApiResponse> => {
  try {
    console.log('Fetching from SerpAPI with query:', query);
    
    // Create URL with all necessary parameters
    const url = new URL(`${API_BASE_URL}/search.json`);
    url.searchParams.append('engine', 'google_shopping');
    url.searchParams.append('q', query);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('gl', 'us');
    url.searchParams.append('hl', 'en');
    
    // Add timestamp to prevent caching
    url.searchParams.append('_t', Date.now().toString());
    
    // Increase the timeout to 20 seconds for production environment
    const timeout = createTimeout(20000); // 20 seconds timeout
    
    try {
      const response = await fetch(url.toString(), {
        ...getRequestOptions(timeout.signal)
      });
      
      timeout.clear();
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SerpAPI error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('SerpAPI response received:', data.search_metadata?.status);
      
      // If the API returns an error field, maintain the error structure
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
      throw error; // Rethrow to be caught by the outer try/catch
    }
    
  } catch (error) {
    console.error("Error fetching from SerpAPI:", error);
    
    // For network errors, provide mock data for testing
    return getMockData(query, error instanceof Error ? error.message : 'Unknown error');
  }
};

// Mock data for testing or when API fails
export function getMockData(query: string, errorMessage: string): SerpApiResponse {
  console.log("Using mock data due to error:", errorMessage);
  
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
