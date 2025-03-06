
import React from 'react';
import InsightCard from '@/components/ui-custom/InsightCard';
import InsightsSkeleton from '@/components/ui-custom/InsightsSkeleton';
import NoResultsMessage from '@/components/ui-custom/NoResultsMessage';

interface InsightsPanelProps {
  products: any[];
  isSearching: boolean;
}

const InsightsPanel = ({ products, isSearching }: InsightsPanelProps) => {
  // Calculate insights from products
  const lowestPrice = products.length 
    ? Math.min(...products.map(p => p.extracted_price)) 
    : 0;
    
  const highestPrice = products.length 
    ? Math.max(...products.map(p => p.extracted_price)) 
    : 0;
    
  const profitPotential = highestPrice - lowestPrice;
  
  // Calculate average price
  const averagePrice = products.length
    ? products.reduce((sum, p) => sum + p.extracted_price, 0) / products.length
    : 0;
  
  // Calculate a simple resale potential score (0-100)
  const resalePotentialScore = products.length && lowestPrice > 0
    ? Math.min(100, Math.round((profitPotential / lowestPrice) * 100))
    : 0;

  if (isSearching) {
    return <InsightsSkeleton />;
  }

  if (products.length === 0) {
    return <NoResultsMessage />;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid md:grid-cols-5 gap-4 animate-slide-up">
        <InsightCard 
          type="highest-price" 
          value={highestPrice}
        />
        <InsightCard 
          type="lowest-price" 
          value={lowestPrice}
        />
        <InsightCard 
          type="average-price" 
          value={averagePrice}
        />
        <InsightCard 
          type="profit" 
          value={profitPotential}
        />
        <InsightCard 
          type="listing-count" 
          value={products.length}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-secondary/30 border">
          <h3 className="font-medium mb-2">What This Means</h3>
          <p className="text-sm text-muted-foreground">
            Based on our analysis, this item has a 
            {resalePotentialScore < 30 ? ' low' : resalePotentialScore < 70 ? ' moderate' : ' high'} 
            resale potential. The average price is ${averagePrice.toFixed(2)}, while the potential profit of ${profitPotential.toFixed(2)} indicates 
            {profitPotential < 50 ? ' limited' : ' significant'} 
            arbitrage opportunities across different marketplaces.
          </p>
        </div>
        
        <InsightCard 
          type="resale-potential" 
          value={`${resalePotentialScore}/100`}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default InsightsPanel;
