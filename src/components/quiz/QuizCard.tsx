import React from 'react';
import { Link } from 'react-router-dom';
import { Quiz } from '@/utils/quizData';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { motion } from 'framer-motion';

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

const QuizCard = ({ quiz, index }: QuizCardProps) => {
  return (
    <Link to={`/quiz/${quiz.id}`}>
      <AnimatedCard 
        className="p-6 h-full flex flex-col cursor-pointer hover-lift" 
        index={index}
        variant="default"
      >
        <div className="mb-4">
          <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {quiz.difficulty}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{quiz.description}</p>
        
        <div className="flex flex-wrap gap-4 mt-auto">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            {quiz.questionCount} Questions
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {quiz.estimatedTime}
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
};

export default QuizCard;
