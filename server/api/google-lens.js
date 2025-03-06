
/**
 * Server-side API route for Google Lens image search
 */
const { handleGoogleLensRequest } = require('../../src/services/api/googleLensService');

/**
 * Express.js handler 
 */
exports.handleRequest = handleGoogleLensRequest;

/**
 * Serverless function handler (Netlify/Vercel/AWS Lambda)
 */
exports.handler = async (event) => {
  try {
    // Convert the serverless request to Express-like format
    const req = {
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
    
    // Call the Express handler
    await handleGoogleLensRequest(req, res);
    
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
