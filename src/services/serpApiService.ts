
// A service for interacting with SerpAPI

interface SerpApiResponse {
  search_metadata: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  search_parameters: {
    engine: string;
    q: string;
    google_domain: string;
    gl: string;
    hl: string;
  };
  shopping_results: {
    position: number;
    title: string;
    link: string;
    source: string;
    price: string;
    extracted_price: number;
    thumbnail: string;
    delivery: string;
  }[];
  error?: string;
}

interface SearchOptions {
  query: string;
  limit?: number;
}

// This should ideally be stored in environment variables
const API_KEY = '4bce77d816528a3073a7ff2607e3cb2b3ff477cfc43bc5bbca830353830ab7f6';

export const searchProducts = async ({ query, limit = 10 }: SearchOptions): Promise<SerpApiResponse> => {
  try {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('engine', 'google_shopping');
    url.searchParams.append('q', query);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('gl', 'us');
    url.searchParams.append('hl', 'en');

    console.log('Fetching from SerpAPI with query:', query);
    
    // Use a proxy approach with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      mode: 'cors', // Explicitly set CORS mode
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('SerpAPI response received');
    
    // If the API returns an error field, maintain the error structure
    if (data.error) {
      console.error('SerpAPI error:', data.error);
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
          engine: 'google_shopping',
          q: query,
          google_domain: 'google.com',
          gl: 'us',
          hl: 'en'
        },
        shopping_results: [],
        error: data.error
      };
    }
    
    // Limit the results if requested
    if (data.shopping_results && limit) {
      data.shopping_results = data.shopping_results.slice(0, limit);
    }
    
    return data;
    
  } catch (error) {
    console.error("Error fetching from SerpAPI:", error);
    
    // For network errors, provide mock data for testing
    if (error instanceof Error && 
        (error.message.includes('Failed to fetch') || 
         error.message.includes('NetworkError') ||
         error.message.includes('Network request failed') ||
         error.name === 'AbortError')) {
      
      console.log("Using mock data due to network/CORS error");
      
      // Return mock data for demonstration purposes
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
            title: "Vintage Book Collection (Mock Data)",
            link: "https://example.com/product1",
            source: "Example Store",
            price: "$24.99",
            extracted_price: 24.99,
            thumbnail: "https://picsum.photos/200/300",
            delivery: "Free shipping"
          },
          {
            position: 2,
            title: "Classic Literature Set (Mock Data)",
            link: "https://example.com/product2",
            source: "Book Store",
            price: "$34.99",
            extracted_price: 34.99,
            thumbnail: "https://picsum.photos/200/301",
            delivery: "Free shipping"
          },
          {
            position: 3,
            title: "Antique Book Collection (Mock Data)",
            link: "https://example.com/product3",
            source: "Vintage Books",
            price: "$129.99",
            extracted_price: 129.99,
            thumbnail: "https://picsum.photos/200/302",
            delivery: "$4.99 shipping"
          }
        ]
      };
    }
    
    // Return a structured error response
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
        engine: 'google_shopping',
        q: query,
        google_domain: 'google.com',
        gl: 'us',
        hl: 'en'
      },
      shopping_results: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const extractSearchQueryFromImage = async (imageFile: File): Promise<string> => {
  try {
    // For actual implementation, you would:
    // 1. Upload the image to a server or directly to a vision API
    // 2. Get text recognition results
    // 3. Return the extracted text or relevant keywords
    
    // This is a simplified implementation that reads the file name
    // In a production app, you would use a vision API like Google Vision, AWS Rekognition, etc.
    const fileName = imageFile.name.toLowerCase();
    
    // Extract keywords from filename as a basic fallback
    if (fileName.includes("harry")) return "Harry Potter book";
    if (fileName.includes("lord")) return "Lord of the Rings book";
    if (fileName.includes("game")) return "Game of Thrones book";
    
    // For a real implementation, you would send the image to a vision API
    console.log("In production, this would use a vision API to analyze the image");
    
    // Default fallback - in production, this would be text extracted from the image
    return "Vintage book collection";
  } catch (error) {
    console.error("Error extracting query from image:", error);
    return "Book collection"; // Default query on error
  }
};
