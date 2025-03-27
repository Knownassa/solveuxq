import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { quizCategories } from '@/utils/quizData';
import CategoryCard from '@/components/categories/CategoryCard';

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Quizzes</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our selection of quizzes categorized by different skills and domains.
            Select a category to explore the available quizzes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
