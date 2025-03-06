import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, CheckCircle2, XCircle, Info, Save } from 'lucide-react';
import { searchProducts } from '@/services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PROXY_ENABLED, 
  CORS_PROXIES, 
  getCurrentProxy, 
  saveCurrentProxy,
  USE_MOCK_DATA,
  IS_DEVELOPMENT
} from '@/services/api/apiConfig';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

  const handleProxyChange = (value: string) => {
    const index = parseInt(value, 10);
    setProxyIndex(index);
    setNetworkDetails(`Selected proxy: ${CORS_PROXIES[index]}`);
  };

  const saveProxy = () => {
    saveCurrentProxy(proxyIndex);
    toast.success('Proxy setting saved', {
      description: `${CORS_PROXIES[proxyIndex]} will be used for all API requests`,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium text-lg">API Connection Test</h3>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Select CORS Proxy:</label>
          <Select 
            value={String(proxyIndex)} 
            onValueChange={handleProxyChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a CORS proxy" />
            </SelectTrigger>
            <SelectContent>
              {CORS_PROXIES.map((proxy, index) => (
                <SelectItem key={proxy} value={String(index)}>
                  Proxy {index + 1}: {proxy.substring(0, 30)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {IS_DEVELOPMENT && (
          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="use-mock-data"
              checked={useMockData}
              onCheckedChange={setUseMockData}
            />
            <Label htmlFor="use-mock-data">Use mock data (for testing)</Label>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={testApi}
            disabled={isLoading}
            className="flex-1"
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
          
          <Button 
            onClick={saveProxy} 
            variant="outline"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Setting
          </Button>
        </div>
      </div>
      
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="space-y-2">
            <p className="font-medium">API connection successful!</p>
            <p>Received {response?.shopping_results?.length || 0} {useMockData ? 'mock' : 'real'} results from SerpAPI.</p>
            <p className="text-sm">
              To use this proxy for all searches, click the "Save Setting" button above.
            </p>
            {networkDetails && (
              <div className="mt-2 text-xs font-mono whitespace-pre-line">
                <Info className="h-3 w-3 inline mr-1" /> {networkDetails}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="space-y-2">
            <p className="font-medium">API connection failed: {errorMessage}</p>
            <p className="text-sm">
              This proxy doesn't seem to work with SerpAPI. Please try another proxy from the dropdown above.
            </p>
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
