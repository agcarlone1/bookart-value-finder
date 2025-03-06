
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
        
        setResponseStatus(response.status);
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
          
          setResponseStatus(response.status);
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
        // We'll still consider the endpoint "accessible" if it exists, even if the POST fails
        setStatus('success');
        setMessage(`API endpoint exists but returned an error when tested`);
        setDetails(`The endpoint ${endpoint} is reachable, but returned an error when tested with a POST request. This may be expected if the endpoint requires specific parameters.`);
      }
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`API endpoint is not accessible: ${errorMessage}`);
      
      // Generate debugging suggestions based on status code
      let suggestionText = 'Debugging suggestions:\n';
      
      if (responseStatus === 404) {
        suggestionText += '1. The route /api/google-lens is not registered on your server\n';
        suggestionText += '2. Check if server/api/google-lens.js exists and is properly configured\n';
        suggestionText += '3. Ensure your backend framework is properly loading the route\n';
        suggestionText += '4. Restart your backend server after making changes\n';
      } else if (responseStatus === 500) {
        suggestionText += '1. Server error (500): Check your server logs for details\n';
        suggestionText += '2. Verify that googleLensService.handleGoogleLensRequest is functioning correctly\n';
        suggestionText += '3. Ensure your API_KEY is valid in apiConfig.ts\n';
        suggestionText += '4. Check for any runtime errors in the server logs\n';
      } else {
        suggestionText += '1. Check if your backend server is running\n';
        suggestionText += '2. Verify VITE_API_URL is set correctly (current: ' + (import.meta.env.VITE_API_URL || '/api') + ')\n';
        suggestionText += '3. Check server logs for errors\n';
        suggestionText += '4. Ensure server/api/google-lens.js is properly exported\n';
        suggestionText += '5. If using local dev server, restart it\n';
      }
      
      setDetails(suggestionText);
    }
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
                  {rawResponse}
                </pre>
              </div>
            )}
            
            {responseStatus && (
              <p className="text-xs mt-2">
                <span className="font-medium">Response Status:</span> {responseStatus}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EndpointCheck;
