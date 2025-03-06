
/**
 * Server-side API route for Google Lens image search
 * 
 * This file should be placed in your server codebase.
 * Depending on your setup, this could be:
 * - Express.js: server/routes/api/google-lens.js
 * - Next.js: pages/api/google-lens.js
 * - Netlify Functions: functions/google-lens.js
 * - Vercel Functions: api/google-lens.js
 */

// Import your fetchGoogleLensResults function - adjust import path as needed
const { fetchGoogleLensResults } = require('../../src/services/api/googleLensService');

/**
 * Express.js handler 
 */
exports.handleRequest = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Missing imageUrl in request body' 
      });
    }
    
    const results = await fetchGoogleLensResults(imageUrl);
    
    // If there was an error in the SERPAPI request
    if (results.error) {
      return res.status(500).json({ 
        error: results.error,
        message: 'Failed to fetch results from SERPAPI'
      });
    }
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in Google Lens API handler:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
};

/**
 * Serverless function handler (Netlify/Vercel/AWS Lambda)
 */
exports.handler = async (event) => {
  try {
    const { imageUrl } = JSON.parse(event.body || '{}');
    
    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing imageUrl in request body' 
        })
      };
    }
    
    const results = await fetchGoogleLensResults(imageUrl);
    
    // If there was an error in the SERPAPI request
    if (results.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: results.error,
          message: 'Failed to fetch results from SERPAPI'
        })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Error in Google Lens API handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'An unexpected error occurred while processing your request'
      })
    };
  }
};
