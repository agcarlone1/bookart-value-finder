
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

type TestStatus = 'idle' | 'success' | 'error';

interface TestResultDisplayProps {
  status: TestStatus;
  errorMessage: string | null;
  networkDetails: string | null;
  response: any;
  useMockData: boolean;
}

const TestResultDisplay = ({ 
  status, 
  errorMessage, 
  networkDetails, 
  response,
  useMockData
}: TestResultDisplayProps) => {
  if (status === 'idle' && !response) {
    return null;
  }

  return (
    <div className="space-y-4">
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

export default TestResultDisplay;
