
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, Check } from 'lucide-react';

const EndpointCheck = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  
  const testEndpoint = async () => {
    try {
      setStatus('checking');
      setMessage('Checking endpoint...');
      setDetails('');
      
      // Get the API URL from environment variables or use a fallback
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const endpoint = `${API_URL}/google-lens`;
      
      // First do a simple HEAD request to see if the endpoint exists
      const response = await fetch(endpoint, {
        method: 'HEAD',
      });
      
      if (!response.ok) {
        throw new Error(`Endpoint check failed: ${response.status} ${response.statusText}`);
      }
      
      setStatus('success');
      setMessage('API endpoint is accessible');
      setDetails(`Successfully reached ${endpoint} (status: ${response.status})`);
      
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`API endpoint is not accessible: ${errorMessage}`);
      
      // Generate debugging suggestions
      let suggestionText = 'Debugging suggestions:\n';
      suggestionText += '1. Check if your backend server is running\n';
      suggestionText += '2. Verify VITE_API_URL is set correctly (current: ' + (import.meta.env.VITE_API_URL || '/api') + ')\n';
      suggestionText += '3. Check server logs for errors\n';
      suggestionText += '4. Ensure server/api/google-lens.js is properly exported\n';
      suggestionText += '5. If using local dev server, restart it';
      
      setDetails(suggestionText);
    }
  };
  
  return (
    <div className="my-4 p-4 border rounded-lg">
      <h3 className="font-medium mb-2">API Endpoint Check</h3>
      <p className="text-sm text-gray-500 mb-3">
        Check if the /api/google-lens endpoint is accessible
      </p>
      
      <Button
        onClick={testEndpoint}
        disabled={status === 'checking'}
        variant="outline"
        className="mb-3"
      >
        {status === 'checking' ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            Checking...
          </>
        ) : (
          'Check Endpoint'
        )}
      </Button>
      
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <p className="font-medium">{message}</p>
            <p className="text-sm mt-1">{details}</p>
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
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EndpointCheck;
