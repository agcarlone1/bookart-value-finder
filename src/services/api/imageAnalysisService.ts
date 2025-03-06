
import { API_KEY, API_BASE_URL, createTimeout, getLensApiParams } from './apiConfig';
import { LensApiResponse } from './types';

export const extractSearchQueryFromImage = async (imageFile: File): Promise<string> => {
  try {
    console.log("Sending image to Google Lens API via SerpAPI");
    
    // Create form data to send the image file
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('engine', 'google_lens');
    formData.append('image_file', imageFile);
    
    // Add lens-specific parameters
    const lensParams = getLensApiParams();
    Object.entries(lensParams).forEach(([key, value]) => {
      if (key !== 'engine') {
        formData.append(key, value);
      }
    });
    
    // Add unique identifier to prevent caching
    formData.append('_t', Date.now().toString());
    
    // Increase the timeout for image processing
    const timeout = createTimeout(40000); // 40 seconds timeout
    
    try {
      console.log("Making request to Google Lens API");
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        body: formData,
        signal: timeout.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
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
      
      // PRIORITIZE EXACT MATCHES - they're often more accurate
      if (data.exact_matches && data.exact_matches.length > 0) {
        console.log("Found exact matches:", data.exact_matches.length);
        
        // Look for book matches in exact matches
        for (const match of data.exact_matches) {
          const title = match.title.toLowerCase();
          
          if (isBookTitle(title)) {
            console.log("Found book match in exact matches:", match.title);
            return cleanBookTitle(match.title) + " book";
          }
        }
        
        // If no book match, use first exact match
        console.log("Using first exact match:", data.exact_matches[0].title);
        return data.exact_matches[0].title;
      }
      
      // FALLBACK TO VISUAL MATCHES
      if (data.visual_matches && data.visual_matches.length > 0) {
        console.log("Analyzing visual matches:", data.visual_matches.length);
        
        // Look for book titles in visual matches
        for (const match of data.visual_matches) {
          const title = match.title.toLowerCase();
          
          if (isBookTitle(title)) {
            console.log("Found book match in visual matches:", match.title);
            return cleanBookTitle(match.title) + " book";
          }
        }
        
        // Try knowledge graph
        if (data.knowledge_graph && data.knowledge_graph.title) {
          console.log("Found knowledge graph title:", data.knowledge_graph.title);
          
          if (data.knowledge_graph.type && 
              (data.knowledge_graph.type.toLowerCase().includes('book') || 
              data.knowledge_graph.type.toLowerCase().includes('novel'))) {
            return cleanBookTitle(data.knowledge_graph.title) + " book";
          }
          
          return data.knowledge_graph.title;
        }
        
        // Use first visual match
        console.log("Using first visual match:", data.visual_matches[0].title);
        return data.visual_matches[0].title;
      }
      
      throw new Error("Could not identify the product in the image");
      
    } catch (error) {
      timeout.clear();
      throw error;
    }
    
  } catch (error) {
    console.error("Error extracting query from image:", error);
    
    // Extract from filename as fallback
    const fileName = imageFile.name.toLowerCase()
      .replace(/\.(jpg|jpeg|png|gif)$/i, "")
      .replace(/[-_]/g, " ");
    
    // Use filename if it contains useful information
    if (fileName.length > 3 && !/^(img|image|photo|pic|picture|dsc|screenshot)\d*$/i.test(fileName)) {
      console.log("Using filename as search query:", fileName);
      
      if (fileName.includes("book") || fileName.includes("novel") || fileName.includes("author")) {
        return fileName + " book";
      }
      
      return fileName;
    }
    
    // Generic fallback
    return "popular books";
  }
};

// Helper function to check if a title is likely a book
function isBookTitle(title: string): boolean {
  return (
    title.includes("book") || 
    title.includes("novel") || 
    title.includes("edition") ||
    title.includes("hardcover") ||
    title.includes("paperback") ||
    title.includes("author") ||
    title.includes("publishing") ||
    title.includes("press") ||
    title.includes("isbn") ||
    title.includes("trilogy")
  );
}

// Helper function to clean a book title
function cleanBookTitle(title: string): string {
  return title
    .replace(/(paperback|hardcover|edition|novel|book)(?:\s*[\-:]\s*|\s+by\s+|\s*$)/i, '')
    .replace(/\s+\(\w+\s+\d{4}\)/, '') // Remove publication dates
    .replace(/\s+ISBN\s+[\d\-X]+/i, '') // Remove ISBN references
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces
    .trim();
}
