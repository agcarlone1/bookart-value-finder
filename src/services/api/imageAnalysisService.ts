
import { API_KEY, API_BASE_URL, createTimeout } from './apiConfig';
import { LensApiResponse } from './types';

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
    const timeout = createTimeout(40000); // 40 seconds timeout
    
    try {
      console.log("Making request to Google Lens API");
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        body: formData,
        signal: timeout.signal,
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
      
      timeout.clear();
      
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
      timeout.clear();
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
