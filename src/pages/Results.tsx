
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui-custom/ProductCard';
import InsightCard from '@/components/ui-custom/InsightCard';
import TabView from '@/components/ui-custom/TabView';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Results = () => {
  const navigate = useNavigate();
  const { searchTerm, searchResults, isSearching, isMockData } = useSearch();
  
  // Convert string prices to numbers for calculations
  const products = searchResults || [];
  
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
    
  const renderSkeletons = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white overflow-hidden animate-pulse">
          <div className="h-[120px] bg-secondary"></div>
          <div className="p-3 space-y-2">
            <div className="h-2 bg-secondary rounded w-1/4"></div>
            <div className="h-3 bg-secondary rounded w-3/4"></div>
            <div className="h-2 bg-secondary rounded w-1/2 mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  // Convert SerpAPI results to our ProductCard format
  const formatProducts = (results: any[]) => {
    return results.map(item => ({
      id: item.position.toString(),
      name: item.title,
      storeName: item.source,
      price: item.extracted_price,
      imageUrl: item.thumbnail,
      link: item.link
    }));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-4 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-4 animate-slide-down">
            <Button 
              variant="ghost" 
              className="mb-2 text-sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Search
            </Button>
            
            <h1 className="text-xl md:text-2xl font-bold mb-1">Search Results</h1>
            <p className="text-muted-foreground text-sm">
              {searchTerm ? (
                <>We found {products.length} matching items for <span className="font-medium">"{searchTerm}"</span></>
              ) : (
                "Searching for products..."
              )}
            </p>
          </div>
          
          {isMockData && (
            <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Using demo data due to API limitations. In a production environment, you would see real product data.
              </AlertDescription>
            </Alert>
          )}
          
          <TabView tabs={["Lowest Price", "Insights"]}>
            {/* Lowest Price Tab */}
            <div>
              {isSearching ? (
                renderSkeletons()
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-slide-up">
                  {products.length > 0 ? (
                    formatProducts(products)
                      .sort((a, b) => a.price - b.price)
                      .map((product, index) => (
                        <ProductCard 
                          key={product.id} 
                          product={product}
                          isBestValue={index === 0}
                        />
                      ))
                  ) : (
                    <div className="py-12 text-center text-muted-foreground col-span-full">
                      <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No products found. Please try another search.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Insights Tab */}
            <div>
              {isSearching ? (
                <div className="grid md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="rounded-xl border bg-white p-4 animate-pulse">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-md bg-secondary mb-1"></div>
                        <div className="w-full text-center space-y-2">
                          <div className="h-2 bg-secondary rounded w-3/4 mx-auto"></div>
                          <div className="h-6 bg-secondary rounded w-1/2 mx-auto"></div>
                          <div className="h-2 bg-secondary rounded w-full mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {products.length > 0 ? (
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
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No insights available. Please try another search.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabView>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
