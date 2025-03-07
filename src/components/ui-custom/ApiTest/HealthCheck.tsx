
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HealthCheck = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setStatus('checking');
      setMessage('Checking API health...');
      setDetails('');

      // Get the API URL from environment variables or use a fallback
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const endpoint = `${API_URL}/health`;

      console.log(`Testing health endpoint: ${endpoint}`);

      const response = await fetch(endpoint);
      const responseText = await response.text();
      console.log('Health check response:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (response.ok && data.status === 'ok') {
        setStatus('success');
        setMessage(`API health check passed: ${data.message}`);
        setDetails(`Server responded with status code ${response.status}`);
      } else {
        throw new Error(`API health check failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`API health check failed: ${errorMessage}`);
      setDetails('Please make sure the API server is running on http://localhost:8080');
      console.error('Health check error:', error);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="font-medium text-sm mb-2">API Health Check</h3>
      
      <Button 
        onClick={checkHealth}
        disabled={status === 'checking'}
        variant="outline"
        className="mb-2"
        size="sm"
      >
        {status === 'checking' ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            Checking...
          </>
        ) : (
          'Check API Health'
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
            <p className="text-sm mt-1">{details}</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default HealthCheck;
