import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useTheme } from '@/hooks/use-theme';

const AboutPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section - Adapted from Home Page */}
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
                Our Mission and Vision
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            >
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Solveuxq</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto text-balance"
            >
              Learn more about our mission to enhance problem-solving skills in UI/UX design, product design, and real-life scenarios through engaging quizzes and AI-driven learning.
              <br /><br />
              Solveuxq is a progressive web application currently in alpha version 0.1.0. We are continuously working to improve and expand our offerings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/" className="neo-button">
                Start Exploring
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
              {/* You can add another button here if needed */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the About Page Content */}
      <div className="container max-w-5xl mx-auto px-6 py-12">
        <AnimatedCard className="p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Solveuxq is dedicated to enhancing problem-solving skills in areas like UI/UX design, product design, and real-life scenarios.
            We believe that regularly challenging yourself with thoughtful problems is one of the best ways to grow as a designer, product manager, or creative thinker.
          </p>

          <p className="text-gray-600">
            Our platform offers engaging quizzes generated by advanced AI, providing a dynamic and continuously evolving learning experience.
            Whether you're a seasoned professional or just starting your journey in design, our quizzes will challenge your thinking and expand your perspective.
          </p>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <AnimatedCard className="p-8" index={0}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <ul className="space-y-4">
              <li className="flex">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-600">Choose a quiz category that interests you or challenges your skills.</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-gray-600">Answer multiple-choice questions at your own pace.</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-gray-600">Get immediate feedback on your answers with explanations.</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 mt-0.5">
                  4
                </div>
                <div>
                  <p className="text-gray-600">Review your results and learn from your responses.</p>
                </div>
              </li>
            </ul>
          </AnimatedCard>

          <AnimatedCard className="p-8" index={1}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Categories</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-2xl mr-3">🎨</div>
                <div>
                  <h3 className="font-medium text-gray-900">UI/UX Design</h3>
                  <p className="text-sm text-gray-600">Usability principles, information architecture, interaction design, and more.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-2xl mr-3">📱</div>
                <div>
                  <h3 className="font-medium text-gray-900">Product Design</h3>
                  <p className="text-sm text-gray-600">Product strategy, user research, prototyping, and development processes.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-2xl mr-3">💡</div>
                <div>
                  <h3 className="font-medium text-gray-900">Problem Solving</h3>
                  <p className="text-sm text-gray-600">Logical reasoning, critical thinking, decision making, and creative challenges.</p>
                </div>
              </div>
               <div className="flex items-start">
                <div className="text-2xl mr-3">✏️</div>
                <div>
                  <h3 className="font-medium text-gray-900">Visual Design</h3>
                  <p className="text-sm text-gray-600">Color theory, typography, composition, and visual communication.</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Removed redundant "Ready to Test Your Skills?" section */}
      </div>
    </div>
  );
};

export default AboutPage;
