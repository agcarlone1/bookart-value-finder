
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  ClerkLoaded, 
  ClerkLoading, 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn 
} from "@clerk/clerk-react";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { SearchProvider } from "./contexts/SearchContext";
import { WishlistProvider } from "./contexts/WishlistContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <WishlistProvider>
          <SearchProvider>
            <Toaster />
            <Sonner />
            <ClerkLoading>
              <div className="h-screen w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/results" element={<Results />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/signin" element={<Auth mode="signIn" />} />
                <Route path="/signup" element={<Auth mode="signUp" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ClerkLoaded>
          </SearchProvider>
        </WishlistProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
