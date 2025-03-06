
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabViewProps {
  children: React.ReactNode[];
  tabs: string[];
}

const TabView: React.FC<TabViewProps> = ({ children, tabs }) => {
  const [activeTab, setActiveTab] = useState("0");
  
  return (
    <Tabs defaultValue="0" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab, index) => (
          <TabsTrigger key={index} value={String(index)} data-state={activeTab === String(index) ? "active" : ""}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {React.Children.map(children, (child, index) => (
        <TabsContent value={String(index)} className="mt-0">
          {child}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabView;
