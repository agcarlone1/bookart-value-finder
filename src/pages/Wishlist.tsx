
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabView from '@/components/ui-custom/TabView';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import WishlistItems from '@/components/wishlist/WishlistItems';
import SearchHistoryList from '@/components/wishlist/SearchHistoryList';
import ClearConfirmationDialog from '@/components/wishlist/ClearConfirmationDialog';

const Wishlist = () => {
  const navigate = useNavigate();
  const { clearWishlist, clearSearchHistory } = useWishlist();
  const [clearWishlistDialogOpen, setClearWishlistDialogOpen] = useState(false);
  const [clearHistoryDialogOpen, setClearHistoryDialogOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-4 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-4 animate-slide-down">
            <Button 
              variant="ghost" 
              className="mb-2 text-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
            
            <h1 className="text-xl md:text-2xl font-bold mb-1">My Wishlist</h1>
            <p className="text-muted-foreground text-sm">
              Save products and easily access your previous searches
            </p>
          </div>
          
          <TabView tabs={["Saved Items", "Search History"]}>
            {/* Saved Items Tab */}
            <WishlistItems onClearWishlist={() => setClearWishlistDialogOpen(true)} />
            
            {/* Search History Tab */}
            <SearchHistoryList onClearHistory={() => setClearHistoryDialogOpen(true)} />
          </TabView>
        </div>
      </main>
      
      <Footer />
      
      {/* Clear Wishlist Confirmation Dialog */}
      <ClearConfirmationDialog
        open={clearWishlistDialogOpen}
        onOpenChange={setClearWishlistDialogOpen}
        onConfirm={clearWishlist}
        title="Clear Wishlist"
        description="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
      />
      
      {/* Clear History Confirmation Dialog */}
      <ClearConfirmationDialog
        open={clearHistoryDialogOpen}
        onOpenChange={setClearHistoryDialogOpen}
        onConfirm={clearSearchHistory}
        title="Clear Search History"
        description="Are you sure you want to clear your search history? This action cannot be undone."
      />
    </div>
  );
};

export default Wishlist;
