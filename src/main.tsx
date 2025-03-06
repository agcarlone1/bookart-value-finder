
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Use environment variable for Clerk publishable key
// For development fallback to a placeholder with warning
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn("⚠️ No Clerk publishable key found. Using placeholder. Set VITE_CLERK_PUBLISHABLE_KEY in your environment.");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
