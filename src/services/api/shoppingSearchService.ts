
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
import { mockSearchResults } from './mockData';

export const searchProducts = async ({ 
  query, 
  limit = 10,
  isBook = false
}: SearchOptions): Promise<SerpApiResponse> => {
  try {
    console.log('Fetching from SerpAPI with query:', query);
    
    // Always use mock data
    console.log('Using mock data for demo purposes');
    return getMockData(query, 'Using mock data for demo', isBook);
    
  } catch (error) {
    console.error("Error fetching from SerpAPI:", error);
    
    // Return mock data on error as well
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`Using mock data due to error: ${errorMessage}`);
    return getMockData(query, errorMessage, isBook);
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
          title: `${query || 'Best Seller'} - First Edition`,
          link: "https://example.com/book1",
          source: "Book Depository",
          price: "$21.99",
          extracted_price: 21.99,
          thumbnail: "https://picsum.photos/id/24/200/300",
          delivery: "Free shipping",
          rating: 4.5,
          reviews: 120
        },
        {
          position: 2,
          title: `${query || 'Popular'} - Paperback`,
          link: "https://example.com/book2",
          source: "Barnes & Noble",
          price: "$14.95",
          extracted_price: 14.95,
          thumbnail: "https://picsum.photos/id/25/200/300",
          delivery: "Free shipping",
          rating: 4.2,
          reviews: 85
        },
        {
          position: 3,
          title: `${query || 'Classic'} - Hardcover Special Edition`,
          link: "https://example.com/book3",
          source: "Amazon",
          price: "$29.99",
          extracted_price: 29.99,
          thumbnail: "https://picsum.photos/id/26/200/300",
          delivery: "$4.99 shipping",
          rating: 3.9,
          reviews: 220
        },
        {
          position: 4,
          title: `${query || 'New Release'} - Illustrated Edition`,
          link: "https://example.com/book4",
          source: "Waterstones",
          price: "$39.99",
          extracted_price: 39.99,
          thumbnail: "https://picsum.photos/id/27/200/300",
          delivery: "Free shipping",
          rating: 4.7,
          reviews: 68
        },
        {
          position: 5,
          title: `${query || 'Budget'} - Digital Edition`,
          link: "https://example.com/book5",
          source: "Kobo",
          price: "$9.99",
          extracted_price: 9.99,
          thumbnail: "https://picsum.photos/id/28/200/300",
          delivery: "Instant download",
          rating: 3.5,
          reviews: 145
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
    shopping_results: mockSearchResults.map((result, index) => ({
      ...result,
      title: query ? `${query} - ${result.title.split('-')[1]}` : result.title
    }))
  };
}
