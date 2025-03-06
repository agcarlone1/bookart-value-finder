
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, CheckCircle2, XCircle, Info } from 'lucide-react';
import { searchProducts } from '@/services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PROXY_ENABLED, PROXY_URL } from '@/services/api/apiConfig';

const ApiTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [networkDetails, setNetworkDetails] = useState<string | null>(null);

  const testApi = async () => {
    try {
      setIsLoading(true);
      setStatus('idle');
      setResponse(null);
      setErrorMessage(null);
      setNetworkDetails(null);
      
      // Use a simple, reliable search term
      const testQuery = 'apple iphone';
      console.log('Testing API with query:', testQuery);
      
      const result = await searchProducts({ query: testQuery, limit: 3 });
      
      console.log('API test result:', result);
      
      // Check if it's mock data
      if (result.search_metadata.status === 'Success (Mock)') {
        setStatus('error');
        setErrorMessage('Received mock data instead of real API data');
        setNetworkDetails(`Using CORS proxy: ${PROXY_ENABLED ? 'Yes' : 'No'}\nProxy URL: ${PROXY_URL}`);
      } else {
        setStatus('success');
      }
      
      // Store response for display
      setResponse(result);
      
    } catch (error) {
      console.error('API test failed:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setNetworkDetails(`Using CORS proxy: ${PROXY_ENABLED ? 'Yes' : 'No'}\nProxy URL: ${PROXY_URL}`);
    } finally {
      setIsLoading(false);
    }
  };

  const tryAgainWithoutProxy = async () => {
    // This function cannot directly modify the global PROXY_ENABLED setting
    // But it shows the user how they could adjust it
    setNetworkDetails("To try without the CORS proxy, you would need to set PROXY_ENABLED to false in apiConfig.ts");
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium text-lg">API Connection Test</h3>
      
      <div className="space-y-2">
        <Button 
          onClick={testApi}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Testing API...
            </>
          ) : (
            'Test SerpAPI Connection'
          )}
        </Button>
        
        {status === 'error' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={tryAgainWithoutProxy}
            className="text-xs w-full"
          >
            Show proxy configuration help
          </Button>
        )}
      </div>
      
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            API connection successful! Received {response?.shopping_results?.length || 0} results.
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="space-y-1">
            <p>API connection failed: {errorMessage}</p>
            {networkDetails && (
              <div className="mt-2 text-xs font-mono whitespace-pre-line">
                <Info className="h-3 w-3 inline mr-1" /> {networkDetails}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {response && (
        <div className="text-xs overflow-x-auto max-h-60 overflow-y-auto p-3 bg-gray-50 rounded border">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestButton;
