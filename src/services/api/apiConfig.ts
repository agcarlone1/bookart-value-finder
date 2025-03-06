
// Shared configuration and utilities for API services

// This should ideally be stored in environment variables
export const API_KEY = '4bce77d816528a3073a7ff2607e3cb2b3ff477cfc43bc5bbca830353830ab7f6';

// API endpoints
export const API_BASE_URL = 'https://serpapi.com';
export const PROXY_ENABLED = true;

// List of CORS proxies to try (in order of preference)
export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors-proxy.htmldriven.com/?url='
];

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

// Get the final URL based on proxy settings
export const getApiUrl = (url: string): string => {
  if (!PROXY_ENABLED) return url;
  const currentProxy = getCurrentProxy();
  return `${currentProxy}${encodeURIComponent(url)}`;
};

// Common request options
export const getRequestOptions = (signal: AbortSignal) => ({
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  },
  signal,
  cache: 'no-store' as RequestCache,
  mode: 'cors' as RequestMode,
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
