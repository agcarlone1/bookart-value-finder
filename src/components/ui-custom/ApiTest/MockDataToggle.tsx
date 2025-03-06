
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MockDataToggleProps {
  useMockData: boolean;
  setUseMockData: (value: boolean) => void;
}

const MockDataToggle = ({ useMockData, setUseMockData }: MockDataToggleProps) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Switch
        id="use-mock-data"
        checked={useMockData}
        onCheckedChange={setUseMockData}
      />
      <Label htmlFor="use-mock-data">Use mock data (for testing)</Label>
    </div>
  );
};

export default MockDataToggle;
