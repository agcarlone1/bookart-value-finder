
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui-custom/ProductCard';
import InsightCard from '@/components/ui-custom/InsightCard';
import TabView from '@/components/ui-custom/TabView';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'First Edition Harry Potter and the Philosopher\'s Stone',
    storeName: 'Rare Books Co.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=400',
    link: '#'
  },
  {
    id: '2',
    name: 'Harry Potter and the Philosopher\'s Stone Hardcover',
    storeName: 'Book Emporium',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=400',
    link: '#'
  },
  {
    id: '3',
    name: 'Harry Potter Book Set - Complete Collection',
    storeName: 'Magic Books',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=400',
    link: '#'
  }
];

const Results = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<typeof mockProducts>([]);
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const lowestPrice = products.length ? Math.min(...products.map(p => p.price)) : 0;
  const highestPrice = products.length ? Math.max(...products.map(p => p.price)) : 0;
  const priceSpread = highestPrice - lowestPrice;
  
  // Calculate a simple resale potential score (0-100)
  const resalePotentialScore = products.length 
    ? Math.min(100, Math.round((priceSpread / lowestPrice) * 100))
    : 0;
    
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border bg-white overflow-hidden animate-pulse">
          <div className="flex md:flex-row flex-col h-full">
            <div className="w-full md:w-1/3 aspect-square md:aspect-auto bg-secondary"></div>
            <div className="p-4 flex-grow space-y-4">
              <div className="h-2 bg-secondary rounded w-1/4"></div>
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2 mt-auto"></div>
              <div className="h-8 bg-secondary rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-slide-down">
            <Button 
              variant="ghost" 
              className="mb-4 text-sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Search
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              We found {products.length} matching items for your search
            </p>
          </div>
          
          <TabView>
            {/* Lowest Price Tab */}
            <div>
              {loading ? (
                renderSkeletons()
              ) : (
                <div className="space-y-4 animate-slide-up">
                  {products
                    .sort((a, b) => a.price - b.price)
                    .map((product, index) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        isBestValue={index === 0}
                      />
                    ))
                  }
                </div>
              )}
              
              {!loading && products.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No products found. Please try another search.</p>
                </div>
              )}
            </div>
            
            {/* Insights Tab */}
            <div>
              {loading ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border bg-white p-4 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary"></div>
                        <div className="flex-grow space-y-2">
                          <div className="h-2 bg-secondary rounded w-3/4"></div>
                          <div className="h-6 bg-secondary rounded w-1/2"></div>
                          <div className="h-2 bg-secondary rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4 animate-slide-up">
                  <InsightCard 
                    type="highest-price" 
                    value={highestPrice}
                  />
                  <InsightCard 
                    type="price-spread" 
                    value={priceSpread}
                  />
                  <InsightCard 
                    type="resale-potential" 
                    value={`${resalePotentialScore}/100`}
                  />
                </div>
              )}
              
              {!loading && products.length > 0 && (
                <div className="mt-8 p-4 rounded-lg bg-secondary/30 border">
                  <h3 className="font-medium mb-2">What This Means</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on our analysis, this item has a 
                    {resalePotentialScore < 30 ? ' low' : resalePotentialScore < 70 ? ' moderate' : ' high'} 
                    resale potential. The price spread indicates 
                    {priceSpread < 50 ? ' limited' : ' significant'} 
                    arbitrage opportunities across different marketplaces.
                  </p>
                </div>
              )}
              
              {!loading && products.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No insights available. Please try another search.</p>
                </div>
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
