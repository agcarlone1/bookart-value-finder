
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { CORS_PROXIES, saveCurrentProxy } from '@/services/api/apiConfig';
import { toast } from 'sonner';

interface ProxySelectorProps {
  proxyIndex: number;
  setProxyIndex: (index: number) => void;
  disabled?: boolean;
}

const ProxySelector = ({ proxyIndex, setProxyIndex, disabled = false }: ProxySelectorProps) => {
  const handleProxyChange = (value: string) => {
    const index = parseInt(value, 10);
    setProxyIndex(index);
  };

  const saveProxy = () => {
    saveCurrentProxy(proxyIndex);
    toast.success('Proxy setting saved', {
      description: `${CORS_PROXIES[proxyIndex]} will be used for all API requests`,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">Select CORS Proxy:</label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Select 
            value={String(proxyIndex)} 
            onValueChange={handleProxyChange}
            disabled={disabled}
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
        
        <Button 
          onClick={saveProxy} 
          variant="outline"
          disabled={disabled}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Setting
        </Button>
      </div>
    </div>
  );
};

export default ProxySelector;
