
// Type definitions for API services

// Common metadata
export interface SerpApiMetadata {
  id: string;
  status: string;
  json_endpoint: string;
  created_at: string;
  processed_at: string;
  google_url?: string;
  raw_html_file?: string;
  total_time_taken?: number;
}

export interface SearchParameters {
  engine: string;
  q?: string;
  google_domain?: string;
  gl?: string;
  hl?: string;
}

// Shopping search types
export interface ShoppingResult {
  position: number;
  title: string;
  link: string;
  source: string;
  price: string;
  extracted_price: number;
  thumbnail: string;
  delivery: string;
  rating?: number;
  reviews?: number;
}

export interface SerpApiResponse {
  search_metadata: SerpApiMetadata;
  search_parameters: SearchParameters;
  shopping_results: ShoppingResult[];
  error?: string;
}

// Google Lens API types
export interface ProductMatch {
  title: string;
  link: string;
  thumbnail: string;
  source: string;
  price?: string;
  extracted_price?: number;
  delivery?: string;
  rating?: number;
  reviews?: number;
  extensions?: string[];
}

export interface LensApiResponse {
  search_metadata: SerpApiMetadata;
  search_parameters: SearchParameters;
  exact_matches?: ProductMatch[];  // Prioritized matches
  visual_matches?: ProductMatch[];
  knowledge_graph?: {
    title?: string;
    type?: string;
    description?: string;
  };
  error?: string;
}

// Google Lens Exact Matches API types
export interface ExactMatch {
  title: string;
  link: string;
  thumbnail: string;
  source: string;
  price?: string;
  extracted_price?: number;
  rating?: number;
  reviews?: number;
}

export interface LensExactMatchesResponse {
  search_metadata: SerpApiMetadata;
  search_parameters: SearchParameters;
  exact_matches: ExactMatch[];
  error?: string;
}

// Search options
export interface SearchOptions {
  query: string;
  limit?: number;
  isBook?: boolean;
}

// Google Lens Request
export interface GoogleLensRequest {
  imageUrl: string;
}
