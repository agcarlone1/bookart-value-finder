
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBox from '@/components/ui-custom/SearchBox';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-balance">
              Find the Best Value for Books, Art & Collectibles
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Upload an image or paste a link to instantly compare prices and get valuable insights on potential resale value.
            </p>
            
            <SearchBox />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-secondary/50 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Upload or Link",
                  description: "Share an image or URL of the item you're interested in."
                },
                {
                  step: 2,
                  title: "Instant Analysis",
                  description: "Our AI finds matching products across multiple marketplaces."
                },
                {
                  step: 3,
                  title: "Compare & Decide",
                  description: "Review prices and insights to make informed decisions."
                }
              ].map((feature) => (
                <div key={feature.step} className="rounded-xl bg-white p-6 shadow-light-md flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {feature.step}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <a 
                href="#search" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
              >
                Get Started Now <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
