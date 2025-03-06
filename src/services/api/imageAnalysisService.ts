
import { API_KEY, API_BASE_URL, createTimeout, getLensApiParams } from './apiConfig';
import { LensApiResponse } from './types';

export const extractSearchQueryFromImage = async (imageFile: File): Promise<string> => {
  try {
    console.log("Sending image to Google Lens API via SerpAPI");
    
    // Create form data to send the image file
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('engine', 'google_lens'); // Using google_lens engine which returns both exact and visual matches
    formData.append('image_file', imageFile);
    
    // Add lens-specific parameters
    const lensParams = getLensApiParams();
    Object.entries(lensParams).forEach(([key, value]) => {
      if (key !== 'engine') { // Skip engine as we already set it
        formData.append(key, value);
      }
    });
    
    // Add unique identifier to prevent caching
    formData.append('_t', Date.now().toString());
    
    // Increase the timeout to 40 seconds for image processing which can take longer
    const timeout = createTimeout(40000); // 40 seconds timeout
    
    try {
      console.log("Making request to Google Lens API with engine: google_lens");
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
        
        // First pass: Look specifically for book titles and authors in exact matches
        for (const match of data.exact_matches) {
          const title = match.title.toLowerCase();
          
          // Check if this looks like a book result
          if (isBookTitle(title)) {
            console.log("Found book match in exact matches:", match.title);
            return cleanBookTitle(match.title) + " book";
          }
        }
        
        // If no book-specific match was found, use the first exact match
        console.log("Using first exact match as search term:", data.exact_matches[0].title);
        return data.exact_matches[0].title;
      }
      
      // FALLBACK TO VISUAL MATCHES if no exact matches
      if (data.visual_matches && data.visual_matches.length > 0) {
        console.log("Analyzing visual matches:", data.visual_matches.length);
        
        // First pass: Look specifically for book titles and authors
        for (const match of data.visual_matches) {
          const title = match.title.toLowerCase();
          
          // Check if this looks like a book result
          if (isBookTitle(title)) {
            console.log("Found book match in visual matches:", match.title);
            return cleanBookTitle(match.title) + " book";
          }
        }
        
        // Second pass: Use knowledge graph if available
        if (data.knowledge_graph && data.knowledge_graph.title) {
          console.log("Found knowledge graph title:", data.knowledge_graph.title);
          
          // Check if knowledge graph contains book type
          if (data.knowledge_graph.type && 
              (data.knowledge_graph.type.toLowerCase().includes('book') || 
               data.knowledge_graph.type.toLowerCase().includes('novel'))) {
            return cleanBookTitle(data.knowledge_graph.title) + " book";
          }
          
          return data.knowledge_graph.title;
        }
        
        // Fallback to first visual match
        console.log("Using first visual match as search term:", data.visual_matches[0].title);
        return data.visual_matches[0].title;
      }
      
      // Try to extract any text visible in the image through OCR data
      if (data.visual_matches) {
        // Extract text from file name - this might contain the book title or author
        const fileName = imageFile.name.toLowerCase();
        
        // Check if filename has parts that look like book information
        const nameParts = fileName.split(/[-_\s.]+/).filter(part => part.length > 2);
        if (nameParts.length > 1) {
          // If filename has multiple parts, try to construct a book query
          console.log("Extracting from filename parts:", nameParts);
          return nameParts.slice(0, 3).join(" ") + " book";
        }
      }
      
      // If no matches found, return a generic query
      throw new Error("Could not identify the product in the image");
      
    } catch (error) {
      timeout.clear();
      throw error; // Rethrow to be caught by the outer try/catch
    }
    
  } catch (error) {
    console.error("Error extracting query from image:", error);
    
    // Extract meaningful information from the filename as fallback
    const fileName = imageFile.name.toLowerCase().replace(/\.(jpg|jpeg|png|gif)$/i, "").replace(/[-_]/g, " ");
    
    // If filename contains useful information, use it
    if (fileName.length > 3 && !/^(img|image|photo|pic|picture|dsc|screenshot)\d*$/i.test(fileName)) {
      console.log("Using filename as search query:", fileName);
      
      // Check if it's likely a book
      if (fileName.includes("book") || fileName.includes("novel") || fileName.includes("author")) {
        return fileName + " book";
      }
      
      return fileName;
    }
    
    // Last resort generic fallback based on image dimensions and type
    return "book";
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
    title.includes("chapter") ||
    title.includes("trilogy") ||
    title.includes("collection")
  );
}

// Helper function to clean a book title
function cleanBookTitle(title: string): string {
  // Remove common suffixes like "Paperback", "Hardcover", etc.
  return title
    .replace(/(paperback|hardcover|edition|novel|book)(?:\s*[\-:]\s*|\s+by\s+|\s*$)/i, '')
    .replace(/\s+\(\w+\s+\d{4}\)/, '') // Remove publication dates like (June 2021)
    .replace(/\s+ISBN\s+[\d\-X]+/i, '') // Remove ISBN references
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
    .trim();
}
