
import React, { useState, useEffect } from 'react';
import { searchProducts } from '@/services/api';
import { 
  PROXY_ENABLED, 
  CORS_PROXIES, 
  USE_MOCK_DATA,
  IS_DEVELOPMENT
} from '@/services/api/apiConfig';
import ProxySelector from './ApiTest/ProxySelector';
import MockDataToggle from './ApiTest/MockDataToggle';
import TestApiButton from './ApiTest/TestApiButton';
import TestResultDisplay from './ApiTest/TestResultDisplay';
import EndpointCheck from './ApiTest/EndpointCheck';

const ApiTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [networkDetails, setNetworkDetails] = useState<string | null>(null);
  const [proxyIndex, setProxyIndex] = useState(0);
  const [useMockData, setUseMockData] = useState(false);

  // Load the saved proxy index from localStorage on component mount
  useEffect(() => {
    const savedProxy = localStorage.getItem('selectedProxy');
    if (savedProxy) {
      setProxyIndex(parseInt(savedProxy));
    }
  }, []);

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
      
      // Try the API call with the selected proxy
      const useProxyUrl = CORS_PROXIES[proxyIndex];
      console.log(`Using proxy: ${useProxyUrl}`);
      
      // Set the mock data flag for this test
      (window as any).useMockDataOverride = useMockData;
      
      // We need to temporarily override the proxy in the API config
      // This doesn't persist - it's just for this test
      (window as any).temporaryProxyOverride = useProxyUrl;
      
      const result = await searchProducts({ 
        query: testQuery, 
        limit: 3
      });
      
      console.log('API test result:', result);
      
      // Check if it's mock data
      if (result.search_metadata.status === 'Success (Mock)') {
        if (useMockData) {
          setStatus('success');
          setNetworkDetails(
            `Mock Data Mode: ON\n` +
            `Using mock data as requested. This is only for testing/development.`
          );
        } else {
          setStatus('error');
          setErrorMessage('Received mock data instead of real API data');
          setNetworkDetails(
            `Using CORS proxy: ${PROXY_ENABLED ? 'Yes' : 'No'}\n` +
            `Proxy URL: ${useProxyUrl}\n\n` +
            `This proxy is not working. Please try a different one.`
          );
        }
      } else {
        setStatus('success');
        setNetworkDetails(`Successfully connected using proxy: ${useProxyUrl}`);
      }
      
      // Store response for display
      setResponse(result);
      
    } catch (error) {
      console.error('API test failed:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setNetworkDetails(
        `Using CORS proxy: ${PROXY_ENABLED ? 'Yes' : 'No'}\n` +
        `Proxy URL: ${CORS_PROXIES[proxyIndex]}\n\n` +
        `This proxy is not working. Please try a different one.`
      );
    } finally {
      setIsLoading(false);
      // Clean up the temporary overrides
      delete (window as any).temporaryProxyOverride;
      delete (window as any).useMockDataOverride;
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium text-lg">API Connection Test</h3>
      
      <EndpointCheck />
      
      <div className="space-y-4">
        <ProxySelector 
          proxyIndex={proxyIndex} 
          setProxyIndex={setProxyIndex} 
          disabled={isLoading} 
        />
        
        {IS_DEVELOPMENT && (
          <MockDataToggle 
            useMockData={useMockData} 
            setUseMockData={setUseMockData} 
          />
        )}
        
        <div className="flex gap-2">
          <TestApiButton onTest={testApi} isLoading={isLoading} />
        </div>
      </div>
      
      <TestResultDisplay 
        status={status}
        errorMessage={errorMessage}
        networkDetails={networkDetails}
        response={response}
        useMockData={useMockData}
      />
    </div>
  );
};

export default ApiTestButton;
