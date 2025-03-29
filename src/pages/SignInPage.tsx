
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the page they were trying to access before being redirected to sign in
  const from = location.state?.from || '/quizzes';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Welcome Back to Solveuxq
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to continue to your account</p>
        </div>
        <SignIn 
          signUpUrl="/sign-up"
          afterSignInUrl={from}
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-none",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignInPage;
