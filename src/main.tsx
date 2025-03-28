
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = "pk_test_bmF0aXZlLXRvbWNhdC0yMC5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    clerkJSVersion="5.56.0-snapshot.v20250312225817"
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    fallbackRedirectUrl="/quizzes"
    afterSignOutUrl="/"
  >
    <App />
  </ClerkProvider>
);
