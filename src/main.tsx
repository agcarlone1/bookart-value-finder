
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Get the Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_dummy_key_for_development';

// Instead of throwing an error, we'll use a fallback for local development
// and show a warning in the console
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn(
    "⚠️ Missing Clerk Publishable Key ⚠️\n" +
    "Add your Clerk publishable key to .env file as VITE_CLERK_PUBLISHABLE_KEY=your_key\n" +
    "Using a dummy key for now. Authentication features will not work properly."
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
