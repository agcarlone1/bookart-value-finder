
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabView from '@/components/ui-custom/TabView';
import SearchBanner from '@/components/ui-custom/SearchBanner';
import ProductList from '@/components/ui-custom/ProductList';
import InsightsPanel from '@/components/ui-custom/InsightsPanel';
import { useSearch } from '@/contexts/SearchContext';

const Results = () => {
  const { searchTerm, searchResults, isSearching, isMockData } = useSearch();
  
  // Get products array (empty if null)
  const products = searchResults || [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <SearchBanner 
            searchTerm={searchTerm} 
            productCount={products.length} 
            isMockData={isMockData} 
          />
          
          <TabView tabs={["Lowest Price", "Insights"]}>
            {/* Lowest Price Tab */}
            <div className="pt-2">
              <ProductList products={products} isSearching={isSearching} />
            </div>
            
            {/* Insights Tab */}
            <div className="pt-2">
              <InsightsPanel products={products} isSearching={isSearching} />
            </div>
          </TabView>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
