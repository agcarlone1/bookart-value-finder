
// Shared configuration and utilities for API services

// This should ideally be stored in environment variables
// But this is a publishable key for SerpAPI that can be safely included in the code
export const API_KEY = '4bce77d816528a3073a7ff2607e3cb2b3ff477cfc43bc5bbca830353830ab7f6';

// API endpoints with proxy option
export const API_BASE_URL = 'https://serpapi.com';
export const PROXY_ENABLED = true; // Toggle this to use proxy

// Using a more reliable CORS proxy service
export const PROXY_URL = 'https://corsproxy.io/?'; // Changed to a more reliable CORS proxy

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
    // Removed the x-cors-api-key as it's not needed for corsproxy.io
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
