
// Shared configuration and utilities for API services

// This should ideally be stored in environment variables
// But this is a publishable key for SerpAPI that can be safely included in the code
export const API_KEY = '4bce77d816528a3073a7ff2607e3cb2b3ff477cfc43bc5bbca830353830ab7f6';

// API endpoints with proxy option
export const API_BASE_URL = 'https://serpapi.com';
export const PROXY_ENABLED = true; // Toggle this to use proxy

// Try a different CORS proxy service
// Options: 
// - https://corsproxy.io/? (current one)
// - https://cors-proxy.htmldriven.com/?url= (alternative)
// - https://cors-anywhere.herokuapp.com/ (requires temporary access)
export const PROXY_URL = 'https://proxy.cors.sh/'; // Updated CORS proxy service

// Get the final URL based on proxy settings
export const getApiUrl = (url: string): string => {
  return PROXY_ENABLED ? `${PROXY_URL}${encodeURIComponent(url)}` : url;
};

// Common request options with CORS headers
export const getRequestOptions = (signal: AbortSignal) => ({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'x-cors-api-key': 'temp_9c4d808a11d11c24d701f2d0f7b31ea3', // API key for proxy.cors.sh service
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
