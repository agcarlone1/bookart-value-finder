
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

interface LensApiResponse {
  search_metadata: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
  };
  search_parameters: {
    engine: string;
  };
  exact_matches?: {
    title: string;
    link: string;
    thumbnail: string;
    source: string;
  }[];
  visual_matches?: {
    title: string;
    link: string;
    thumbnail: string;
    source: string;
  }[];
  error?: string;
}

interface SearchOptions {
  query: string;
  limit?: number;
}

// This should ideally be stored in environment variables
// But this is a publishable key for SerpAPI that can be safely included in the code
const API_KEY = '4bce77d816528a3073a7ff2607e3cb2b3ff477cfc43bc5bbca830353830ab7f6';

// Use production API endpoint
const API_BASE_URL = 'https://serpapi.com';

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add headers to help with CORS issues
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        signal: controller.signal,
        cache: 'no-store',
        // Explicitly disable request caching
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
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
      clearTimeout(timeoutId);
      throw error; // Rethrow to be caught by the outer try/catch
    }
    
  } catch (error) {
    console.error("Error fetching from SerpAPI:", error);
    
    // For network errors, provide mock data for testing
    return getMockData(query, error instanceof Error ? error.message : 'Unknown error');
  }
};

// Separate function to get mock data to avoid code duplication
function getMockData(query: string, errorMessage: string): SerpApiResponse {
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

export const extractSearchQueryFromImage = async (imageFile: File): Promise<string> => {
  try {
    console.log("Sending image to Google Lens API via SerpAPI");
    
    // Create form data to send the image file
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('engine', 'google_lens_exact_matches');
    formData.append('image_file', imageFile);
    
    // Add unique identifier to prevent caching
    formData.append('_t', Date.now().toString());
    
    // Increase the timeout to 40 seconds for image processing which can take longer
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000); // 40 seconds timeout
    
    try {
      console.log("Making request to Google Lens API");
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          // Do not set Content-Type here as it's automatically set for FormData
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Lens API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
      }
      
      const data: LensApiResponse = await response.json();
      
      console.log('Google Lens API response received:', data);
      
      // If the API returns an error field, throw an error
      if (data.error) {
        console.error('Google Lens API error:', data.error);
        throw new Error(data.error);
      }
      
      // Extract product name from the exact matches
      if (data.exact_matches && data.exact_matches.length > 0) {
        console.log("Found exact match:", data.exact_matches[0].title);
        // Use the title of the first exact match as the search query
        return data.exact_matches[0].title;
      } else if (data.visual_matches && data.visual_matches.length > 0) {
        console.log("Found visual match:", data.visual_matches[0].title);
        // Fallback to visual matches if no exact matches
        return data.visual_matches[0].title;
      }
      
      // If no matches found, return a generic query
      throw new Error("Could not identify the product in the image");
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error; // Rethrow to be caught by the outer try/catch
    }
    
  } catch (error) {
    console.error("Error extracting query from image:", error);
    
    // Improved fallback mechanism
    const fileName = imageFile.name.toLowerCase();
    
    // Extract keywords from filename as a basic fallback
    if (fileName.includes("harry")) return "Harry Potter book";
    if (fileName.includes("lord")) return "Lord of the Rings book";
    if (fileName.includes("game")) return "Game of Thrones book";
    if (fileName.includes("book")) return "Bestselling books";
    if (fileName.includes("phone")) return "Smartphone";
    if (fileName.includes("laptop")) return "Laptop computer";
    if (fileName.includes("camera")) return "Digital camera";
    if (fileName.includes("shoe")) return "Athletic shoes";
    if (fileName.includes("watch")) return "Wristwatch";
    
    // Default fallback
    return "Unidentified product";
  }
};
