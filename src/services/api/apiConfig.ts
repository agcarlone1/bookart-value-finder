
// Shared configuration and utilities for API services

// This should ideally be stored in environment variables
export const API_KEY = '4bce77d816528a3073a7ff2607e3cb2b3ff477cfc43bc5bbca830353830ab7f6';

// API endpoints
export const API_BASE_URL = 'https://serpapi.com';

// CORS proxy settings
export const PROXY_ENABLED = true;

// List of CORS proxies to try (in order of preference)
export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors-proxy.htmldriven.com/?url=',
  'https://proxy.cors.sh/',
  'https://thingproxy.freeboard.io/fetch/',
  'https://crossorigin.me/',
];

// Check if we're in development
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Determines whether to bypass CORS completely and use mock data
// This is useful for development when all proxies are failing
export const USE_MOCK_DATA_ONLY = false;

// Get current proxy URL from localStorage or use default
export const getCurrentProxy = (): string => {
  const savedProxy = localStorage.getItem('selectedProxy');
  // If nothing is saved or the index is invalid, use the first proxy
  if (!savedProxy || parseInt(savedProxy) >= CORS_PROXIES.length) {
    return CORS_PROXIES[0];
  }
  return CORS_PROXIES[parseInt(savedProxy)];
};

// Save current proxy to localStorage
export const saveCurrentProxy = (proxyIndex: number): void => {
  localStorage.setItem('selectedProxy', proxyIndex.toString());
};

// Get direct URL (no proxy)
export const getDirectApiUrl = (endpoint: string, params: Record<string, string>): string => {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  
  // Add all parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  // Add API key
  url.searchParams.append('api_key', API_KEY);
  
  // Add timestamp to prevent caching
  url.searchParams.append('_t', Date.now().toString());
  
  return url.toString();
};

// Get the final URL based on proxy settings
export const getApiUrl = (endpoint: string, params: Record<string, string>): string => {
  const directUrl = getDirectApiUrl(endpoint, params);
  
  if (!PROXY_ENABLED) return directUrl;
  
  const currentProxy = getCurrentProxy();
  return `${currentProxy}${encodeURIComponent(directUrl)}`;
};

// Enhanced request options with customization and User-Agent
export const getRequestOptions = (
  signal: AbortSignal, 
  options: RequestInit = {}
) => ({
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

// Common timeout handler
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

// Common error handling
export const handleApiError = (error: unknown): never => {
  console.error("API Error:", error);
  if (error instanceof Error) {
    throw error;
  } else {
    throw new Error(String(error));
  }
};

// Book-specific search parameters
export const getBookSearchParams = (query: string): Record<string, string> => {
  return {
    'engine': 'google_shopping',
    'q': `${query} book`,
    'gl': 'us',
    'hl': 'en',
    'tbm': 'shop',
    'tbs': 'vw:l,mr:1,pdtr0:936965|936966', // Filter for books
  };
};

// Google Lens API parameters
export const getLensApiParams = (): Record<string, string> => {
  return {
    'engine': 'google_lens',  // Changed from 'google_lens_exact_matches' to 'google_lens'
    'gl': 'us',
    'hl': 'en',
  };
};

// Enhanced general search parameters
export const getGeneralSearchParams = (query: string): Record<string, string> => {
  return {
    'engine': 'google_shopping',
    'q': query,
    'gl': 'us',
    'hl': 'en'
  };
};
