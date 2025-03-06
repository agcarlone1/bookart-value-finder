
// Type definitions for API responses

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

export interface ShoppingResult {
  position: number;
  title: string;
  link: string;
  source: string;
  price: string;
  extracted_price: number;
  thumbnail: string;
  delivery: string;
}

export interface SerpApiResponse {
  search_metadata: SerpApiMetadata;
  search_parameters: SearchParameters;
  shopping_results: ShoppingResult[];
  error?: string;
}

export interface ExactMatch {
  title: string;
  link: string;
  thumbnail: string;
  source: string;
}

export interface LensApiResponse {
  search_metadata: SerpApiMetadata;
  search_parameters: SearchParameters;
  exact_matches?: ExactMatch[];
  visual_matches?: ExactMatch[];
  error?: string;
}

export interface SearchOptions {
  query: string;
  limit?: number;
}
