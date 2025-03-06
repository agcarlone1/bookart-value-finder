
/**
 * Server-side API route for Google Lens image search
 */
const { handleGoogleLensRequest } = require('../../src/services/api/googleLensService');

// Log when the module is loaded to help debugging
console.log('Server: /api/google-lens endpoint module loaded');

/**
 * Express.js handler 
 */
exports.handleRequest = handleGoogleLensRequest;

/**
 * Default export for Next.js API routes and similar frameworks
 */
module.exports = handleGoogleLensRequest;

/**
 * Alternative export format for ESM
 */
export default function handler(req, res) {
  console.log('Server: /api/google-lens default handler called with method:', req.method);
  
  // Explicitly check for POST method
  if (req.method !== 'POST') {
    console.log('Server: Method not allowed:', req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  // If it's a POST request, use the handleGoogleLensRequest function
  return handleGoogleLensRequest(req, res);
}

/**
 * Serverless function handler (Netlify/Vercel/AWS Lambda)
 */
exports.handler = async (event) => {
  console.log('Server: Serverless handler for /api/google-lens called');
  console.log('Server: Event headers:', event.headers);
  console.log('Server: Event body:', event.body ? event.body.substring(0, 100) + '...' : 'empty');
  
  try {
    // Convert the serverless request to Express-like format
    const req = {
      method: event.httpMethod || 'POST', // Ensure method is explicitly set
      headers: event.headers || {},
      body: JSON.parse(event.body || '{}')
    };
    
    // Create a response object that mimics Express
    let statusCode = 200;
    let responseBody = {};
    
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        responseBody = data;
        return res;
      }
    };
    
    // Check method explicitly
    if (req.method !== 'POST') {
      console.log('Server: Serverless - Method not allowed:', req.method);
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }
    
    // Call the Express handler
    await handleGoogleLensRequest(req, res);
    
    console.log('Server: Serverless handler completed with status:', statusCode);
    
    // Return the response in serverless format
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(responseBody)
    };
  } catch (error) {
    console.error('Error in Google Lens API serverless handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'An unexpected error occurred while processing your request'
      })
    };
  }
};
