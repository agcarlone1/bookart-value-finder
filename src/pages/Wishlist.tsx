
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui-custom/ProductCard';
import TabView from '@/components/ui-custom/TabView';
import { ArrowLeft, Heart, History, Trash2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist, SearchHistoryItem } from '@/contexts/WishlistContext';
import { useSearch } from '@/contexts/SearchContext';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, searchHistory, clearWishlist, clearSearchHistory, removeFromWishlist } = useWishlist();
  const { performSearch } = useSearch();
  const { user } = useUser();
  const [clearWishlistDialogOpen, setClearWishlistDialogOpen] = useState(false);
  const [clearHistoryDialogOpen, setClearHistoryDialogOpen] = useState(false);
  
  // Format the products for ProductCard component
  const formatProducts = (items: any[]) => {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      storeName: item.storeName,
      price: item.price,
      imageUrl: item.imageUrl,
      link: item.link
    }));
  };
  
  const handleSearchAgain = (historyItem: SearchHistoryItem) => {
    // This is a simplified implementation since we can't actually reproduce image searches
    // In a real app, you might store the image URL or other data needed to reproduce the search
    performSearch({
      type: 'url',
      value: historyItem.searchTerm
    });
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
          
          <SignedIn>
            <div className="mb-4 bg-muted/30 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.username || 'User'} 
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{user?.username || user?.firstName || 'Your account'}</p>
                  <p className="text-xs text-muted-foreground">Your wishlist is now synced with your account</p>
                </div>
              </div>
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="mb-4 bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">
                Sign in to sync your wishlist across all your devices
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/signin')} size="sm">
                  <LogIn size={16} className="mr-1" />
                  Sign In
                </Button>
                <Button variant="outline" onClick={() => navigate('/signup')} size="sm">
                  Create Account
                </Button>
              </div>
            </div>
          </SignedOut>
          
          <TabView tabs={["Saved Items", "Search History"]}>
            {/* Saved Items Tab */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-primary" />
                  <span className="text-lg font-medium">
                    {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                
                {wishlistItems.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setClearWishlistDialogOpen(true)}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-slide-up">
                  {formatProducts(wishlistItems).map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Your wishlist is empty. Add items by clicking the heart icon on products.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/')}
                  >
                    Start Searching
                  </Button>
                </div>
              )}
            </div>
            
            {/* Search History Tab */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-primary" />
                  <span className="text-lg font-medium">
                    {searchHistory.length} Search {searchHistory.length === 1 ? 'Entry' : 'Entries'}
                  </span>
                </div>
                
                {searchHistory.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setClearHistoryDialogOpen(true)}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear History
                  </Button>
                )}
              </div>
              
              {searchHistory.length > 0 ? (
                <div className="space-y-2 animate-slide-up">
                  {searchHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border hover:shadow-light-sm transition-all">
                      <div className="flex flex-col">
                        <div className="font-medium">{item.searchTerm}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="capitalize">{item.searchType} search</span>
                          <span>•</span>
                          <span>{format(new Date(item.timestamp), 'MMM d, yyyy - h:mm a')}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSearchAgain(item)}
                      >
                        Search Again
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Your search history is empty. Start searching to build history.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/')}
                  >
                    Start Searching
                  </Button>
                </div>
              )}
            </div>
          </TabView>
        </div>
      </main>
      
      <Footer />
      
      {/* Clear Wishlist Confirmation Dialog */}
      <AlertDialog open={clearWishlistDialogOpen} onOpenChange={setClearWishlistDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all items from your wishlist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={clearWishlist}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Clear History Confirmation Dialog */}
      <AlertDialog open={clearHistoryDialogOpen} onOpenChange={setClearHistoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Search History</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your search history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={clearSearchHistory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Wishlist;
