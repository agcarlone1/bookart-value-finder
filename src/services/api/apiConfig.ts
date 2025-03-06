
// Shared configuration for API services

// SerpAPI key - should ideally be stored in environment variables in production
export const API_KEY = '4bce77d816528a3073a7ff2607e3cb2b3ff477cfc43bc5bbca830353830ab7f6';

// API endpoints
export const API_BASE_URL = 'https://serpapi.com';

// CORS proxy settings
export const PROXY_ENABLED = true;
export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors-proxy.htmldriven.com/?url=',
];

// Development flags
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const USE_MOCK_DATA = import.meta.env.DEV; // Default to mock data in development

// Helper functions for API URLs
export const getCurrentProxy = (): string => {
  const savedProxy = localStorage.getItem('selectedProxy');
  return !savedProxy || parseInt(savedProxy) >= CORS_PROXIES.length
    ? CORS_PROXIES[0]
    : CORS_PROXIES[parseInt(savedProxy)];
};

export const saveCurrentProxy = (proxyIndex: number): void => {
  localStorage.setItem('selectedProxy', proxyIndex.toString());
};

export const getApiUrl = (endpoint: string, params: Record<string, string>): string => {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  
  // Add all parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  // Add API key
  url.searchParams.append('api_key', API_KEY);
  
  // Add timestamp to prevent caching
  url.searchParams.append('_t', Date.now().toString());
  
  const directUrl = url.toString();
  
  return PROXY_ENABLED ? `${getCurrentProxy()}${encodeURIComponent(directUrl)}` : directUrl;
};

// Search parameter templates
export const getBookSearchParams = (query: string): Record<string, string> => ({
  'engine': 'google_shopping',
  'q': `${query} book`,
  'gl': 'us',
  'hl': 'en',
  'tbm': 'shop',
  'tbs': 'vw:l,mr:1,pdtr0:936965|936966', // Filter for books
});

export const getGeneralSearchParams = (query: string): Record<string, string> => ({
  'engine': 'google_shopping',
  'q': query,
  'gl': 'us',
  'hl': 'en'
});

export const getLensApiParams = (): Record<string, string> => ({
  'engine': 'google_lens',
  'gl': 'us',
  'hl': 'en',
});

export const getLensExactMatchesParams = (imageUrl: string): Record<string, string> => ({
  'engine': 'google_lens_exact_matches',
  'url': imageUrl,
  'gl': 'us',
  'hl': 'en',
});

// Request helpers
export const createTimeout = (ms: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  
  return {
    controller,
    timeoutId,
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId)
  };
};

export const getRequestOptions = (signal: AbortSignal, options: RequestInit = {}) => ({
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    ...options.headers,
  },
  signal,
  cache: 'no-store' as RequestCache,
  mode: 'cors' as RequestMode,
  ...options,
});
