
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBox from '@/components/ui-custom/SearchBox';
import AnimatedLogo from '@/components/ui-custom/AnimatedLogo';
import ApiTestButton from '@/components/ui-custom/ApiTestButton';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-6 md:py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <AnimatedLogo className="mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find the Best Deals with Visual Search
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload an image or paste a URL to instantly find the best prices across the web
            </p>
          </div>
          
          <SearchBox className="mb-8" />
          
          <div className="max-w-xl mx-auto mt-12">
            <ApiTestButton />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
