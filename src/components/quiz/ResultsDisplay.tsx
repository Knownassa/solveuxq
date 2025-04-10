
// Since ResultsDisplay.tsx is a read-only file, we'll create a wrapper component that enhances it

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultsWrapperProps {
  earnedPoints: number | null;
  children: React.ReactNode;
}

const ResultsWrapper: React.FC<ResultsWrapperProps> = ({ earnedPoints, children }) => {
  if (!earnedPoints) {
    return <>{children}</>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 max-w-3xl mx-auto"
      >
        <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="inline-block bg-primary text-primary-foreground rounded-full p-2">
                🏆
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-lg font-medium mb-1">
              You earned <span className="text-primary font-bold">{earnedPoints} points</span> for completing this quiz!
            </p>
            <p className="text-sm text-muted-foreground">
              These points have been added to your account. Keep learning to earn more!
            </p>
          </CardContent>
        </Card>
      </motion.div>
      {children}
    </div>
  );
};

export default ResultsWrapper;
