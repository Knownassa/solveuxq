import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

const Hero = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20 pb-20">
      {/* Background gradient */}
      <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50/50 to-transparent'}`}></div>

      
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-blue-100/50 blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-indigo-100/50 blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mb-6">
              Challenge Your Problem-Solving Skills
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            Master UI/UX &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Product Design
            </span>{' '}
            Challenges
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto text-balance"
          >
            Solveuxq offers engaging quizzes to test and enhance your skills in design thinking, user experience, and creative problem-solving. Perfect for designers, product managers, and curious minds.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/categories" className="neo-button">
              Explore Categories
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
            <Link to="/about" className="neo-button-secondary">
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
