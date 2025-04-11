
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import CategoryList from '@/components/home/CategoryList';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  // If user is signed in, redirect them to the study page
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/study');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLandingPage={true} />
      <Hero />
      <CategoryList />
      
      <div className="container max-w-7xl mx-auto px-6 py-20 text-center">
        <SignedOut>
          <h2 className="text-3xl font-bold mb-6">Ready to start learning?</h2>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/sign-up')}
            >
              Get Started
            </Button>
          </div>
        </SignedOut>
        
        <SignedIn>
          <h2 className="text-3xl font-bold mb-6">Continue your learning journey</h2>
          <Button 
            size="lg"
            onClick={() => navigate('/study')}
          >
            Go to Study Dashboard
          </Button>
        </SignedIn>
      </div>
    </div>
  );
};

export default Index;
