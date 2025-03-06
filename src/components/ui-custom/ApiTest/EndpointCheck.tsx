
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, Check, Terminal } from 'lucide-react';

const EndpointCheck = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [rawResponse, setRawResponse] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [headStatus, setHeadStatus] = useState<number | null>(null);
  const [postStatus, setPostStatus] = useState<number | null>(null);
  
  // Run the check automatically on component mount
  useEffect(() => {
    testEndpoint();
  }, []);
  
  const testEndpoint = async () => {
    try {
      setStatus('checking');
      setMessage('Checking endpoint...');
      setDetails('');
      setRawResponse('');
      setResponseStatus(null);
      setHeadStatus(null);
      setPostStatus(null);
      
      // Get the API URL from environment variables or use a fallback
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const endpoint = `${API_URL}/google-lens`;
      
      console.log(`Testing endpoint: ${endpoint}`);
      
      // First do a simple HEAD request to see if the endpoint exists
      let response;
      try {
        response = await fetch(endpoint, {
          method: 'HEAD',
        });
        
        setHeadStatus(response.status);
        console.log(`HEAD request response status: ${response.status}`);
        
        if (response.status === 404) {
          throw new Error(`Endpoint not found (404). The route /api/google-lens is not registered on the server.`);
        }
        
        if (!response.ok) {
          throw new Error(`Endpoint check failed: ${response.status} ${response.statusText}`);
        }
      } catch (headError) {
        console.error('HEAD request failed:', headError);
        
        // If HEAD failed, try a GET request as a fallback
        console.log('Attempting GET request as fallback...');
        try {
          response = await fetch(endpoint, {
            method: 'GET',
          });
          
          setHeadStatus(response.status);
          console.log(`GET fallback response status: ${response.status}`);
          
          if (!response.ok) {
            throw new Error(`Endpoint check failed: ${response.status} ${response.statusText}`);
          }
        } catch (getError) {
          throw getError;
        }
      }
      
      // If we've made it here, the endpoint is accessible, now let's try to get some response content
      try {
        // Make a test POST request with a sample image URL to get actual response content
        const testResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            imageUrl: 'https://via.placeholder.com/150' 
          }),
        });
        
        setPostStatus(testResponse.status);
        setResponseStatus(testResponse.status);
        console.log(`POST test response status: ${testResponse.status}`);
        
        // Get the raw response
        const rawText = await testResponse.text();
        setRawResponse(rawText);
        console.log('Raw response:', rawText);
        
        // If the response is JSON, parse and check it
        let jsonData = null;
        if (rawText && (rawText.startsWith('{') || rawText.startsWith('['))) {
          try {
            jsonData = JSON.parse(rawText);
            console.log('Parsed JSON response:', jsonData);
          } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
          }
        }
        
        if (testResponse.ok) {
          setStatus('success');
          setMessage(`API endpoint is accessible (${testResponse.status} ${testResponse.statusText})`);
          setDetails(`Successfully reached ${endpoint}\nContent-Type: ${testResponse.headers.get('content-type') || 'Not specified'}`);
        } else {
          throw new Error(`Endpoint returned error status: ${testResponse.status} ${testResponse.statusText}`);
        }
      } catch (postError) {
        console.error('POST test request failed:', postError);
        
        // Change the logic here: We'll consider it an error if the POST fails
        setStatus('error');
        setMessage(`API endpoint exists but POST request failed`);
        
        // Generate detailed analysis based on the specific POST status code
        if (postStatus === 404) {
          setDetails(`The endpoint ${endpoint} exists (HEAD returned ${headStatus}), but does not handle POST requests (404).\n\nThis indicates the server route is registered but either doesn't have a POST handler implemented or the handler is misconfigured.`);
        } else if (postStatus === 500) {
          setDetails(`The endpoint ${endpoint} exists (HEAD returned ${headStatus}), but returned a server error (500) when testing with POST.\n\nThis indicates the route handler has an internal error in the server-side code.`);
        } else {
          setDetails(`The endpoint ${endpoint} exists (HEAD returned ${headStatus}), but returned an unexpected status (${postStatus}) when testing with POST.\n\nThis requires investigation in the server-side code.`);
        }
      }
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`API endpoint is not accessible: ${errorMessage}`);
      
      // Generate debugging suggestions based on status code
      let suggestionText = 'Analysis and debugging suggestions:\n\n';
      
      if (responseStatus === 404) {
        suggestionText += '• Route Issue: The route /api/google-lens is not registered on your server\n';
        suggestionText += '• Expected Location: Ensure server/api/google-lens.js exists\n';
        suggestionText += '• Handler Configuration: Check that the route correctly handles both HEAD and POST methods\n';
        suggestionText += '• Server Implementation: Request handler might be missing or incorrectly exported\n';
        suggestionText += '• Server Restart: Restart your backend server after making changes\n';
      } else if (responseStatus === 500) {
        suggestionText += '• Server Error (500): Check your server logs for detailed error stack traces\n';
        suggestionText += '• Handler Implementation: Verify that handleGoogleLensRequest is functioning correctly\n';
        suggestionText += '• API Configuration: Ensure your API_KEY in apiConfig.ts is valid\n';
        suggestionText += '• Request Format: Confirm the expected JSON structure matches what the server expects\n';
        suggestionText += '• Runtime Environment: Check for any Node.js dependencies that might be missing\n';
      } else {
        suggestionText += '• Server Status: Verify your backend server is running\n';
        suggestionText += '• Environment Configuration: Check VITE_API_URL is set correctly (current: ' + (import.meta.env.VITE_API_URL || '/api') + ')\n';
        suggestionText += '• Server Logs: Review logs for startup errors or route registration issues\n';
        suggestionText += '• Implementation Check: Confirm server/api/google-lens.js is properly exported and handles the correct HTTP methods\n';
        suggestionText += '• Development Environment: Restart the local dev server if changes were made\n';
      }
      
      setDetails(suggestionText);
    }
  };
  
  const getStatusSummary = () => {
    if (headStatus !== null && postStatus !== null) {
      return `HEAD: ${headStatus} ${headStatus === 200 ? '✓' : '✗'} | POST: ${postStatus} ${postStatus === 200 ? '✓' : '✗'}`;
    }
    return '';
  };
  
  return (
    <div className="my-4 p-4 border rounded-lg">
      <h3 className="font-medium mb-2 flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        API Endpoint Check
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        Checking if the /api/google-lens endpoint is accessible
      </p>
      
      <Button
        onClick={testEndpoint}
        disabled={status === 'checking'}
        variant="outline"
        className="mb-3"
        size="sm"
      >
        {status === 'checking' ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            Checking...
          </>
        ) : (
          'Run Check Again'
        )}
      </Button>
      
      {getStatusSummary() && (
        <div className="text-sm mb-3 font-mono bg-gray-50 p-2 rounded">
          {getStatusSummary()}
        </div>
      )}
      
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <p className="font-medium">{message}</p>
            <p className="text-sm mt-1 whitespace-pre-line">{details}</p>
            
            {rawResponse && (
              <div className="mt-3">
                <p className="text-xs font-medium mb-1">Raw Response:</p>
                <pre className="text-xs mt-1 bg-gray-50 p-2 rounded border max-h-32 overflow-auto">
                  {rawResponse}
                </pre>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <p className="font-medium">{message}</p>
            <pre className="text-sm mt-2 whitespace-pre-wrap font-mono bg-gray-50 p-2 rounded border">
              {details}
            </pre>
            
            {rawResponse && (
              <div className="mt-3">
                <p className="text-xs font-medium mb-1">Raw Response:</p>
                <pre className="text-xs mt-1 bg-gray-50 p-2 rounded border max-h-32 overflow-auto">
                  {rawResponse || '(empty response)'}
                </pre>
              </div>
            )}
            
            {(headStatus !== null || postStatus !== null) && (
              <p className="text-xs mt-2 font-mono">
                {headStatus !== null && <span className="mr-4">HEAD Status: {headStatus}</span>}
                {postStatus !== null && <span>POST Status: {postStatus}</span>}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EndpointCheck;
