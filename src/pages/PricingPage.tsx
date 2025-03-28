
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you and start improving your UX knowledge today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border rounded-xl p-8 bg-card"
          >
            <div className="mb-6">
              <p className="text-lg font-medium text-primary mb-2">Free Solver</p>
              <h3 className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></h3>
              <p className="mt-3 text-muted-foreground">Perfect for casual learners</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Access to all quiz categories</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>10 quizzes per day</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Leaderboard access</span>
              </li>
            </ul>

            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link to="/quizzes">
                <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                  Access Quizzes
                </button>
              </Link>
            </SignedIn>
          </motion.div>

          {/* Paid Plan (Coming Soon) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-primary/30 rounded-xl p-8 bg-card relative overflow-hidden"
          >
            <div className="absolute -right-12 top-6 rotate-45 bg-primary text-white text-sm px-12 py-1 shadow-md">
              Coming Soon
            </div>
            
            <div className="mb-6">
              <p className="text-lg font-medium text-primary mb-2">Paid Challenger</p>
              <h3 className="text-4xl font-bold">$9<span className="text-lg font-normal text-muted-foreground">/month</span></h3>
              <p className="mt-3 text-muted-foreground">For dedicated UX professionals</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>50 quizzes per day</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Advanced analytics & progress tracking</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Personalized learning paths</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Premium study materials</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Priority leaderboard ranking</span>
              </li>
            </ul>

            <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed">
              Coming Soon
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
