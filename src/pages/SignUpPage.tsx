
import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Join Solveuxq
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Create an account to start learning</p>
        </div>
        <SignUp 
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
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

export default SignUpPage;
