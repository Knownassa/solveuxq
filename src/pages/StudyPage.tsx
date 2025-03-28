import React from 'react';
import Navbar from '@/components/layout/Navbar';

const StudyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Study</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Coming Soon!</p>
      </div>
    </div>
  );
};
export default StudyPage;
