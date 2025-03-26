import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Question } from '@/utils/quizData';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  results: { question: Question; selectedOptionId: string }[];
  categoryId?: string;
  quizId?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, categoryId, quizId }) => {
  const navigate = useNavigate();
  
  const correctAnswers = results.filter(
    result => result.selectedOptionId === result.question.correctOptionId
  );
  
  const score = (correctAnswers.length / results.length) * 100;
  
  const getScoreMessage = () => {
    if (score >= 90) return "Excellent! You're a true expert!";
    if (score >= 75) return "Great job! You know your stuff!";
    if (score >= 60) return "Good work! You've got a solid understanding.";
    if (score >= 40) return "Nice effort! There's room for improvement.";
    return "Keep practicing! You'll get better with time.";
  };
  
  const getScoreColor = () => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 rounded-2xl mb-8 text-center"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white shadow-sm mb-4">
            <span className={cn(
              "text-3xl font-bold",
              getScoreColor()
            )}>
              {score.toFixed(0)}%
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            You got {correctAnswers.length} out of {results.length} questions correct.
          </p>
          <p className="text-gray-700 font-medium">
            {getScoreMessage()}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="neo-button-secondary"
          >
            Try Again
          </button>
          <Link to={categoryId ? `/category/${categoryId}` : '/'} className="neo-button">
            More Quizzes
          </Link>
        </div>
      </motion.div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Review Your Answers
        </h3>
      </div>
      
      {results.map((result, index) => (
        <motion.div
          key={result.question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-card p-6 rounded-xl mb-6"
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
              result.selectedOptionId === result.question.correctOptionId 
                ? "bg-green-100 text-green-600" 
                : "bg-red-100 text-red-600"
            )}>
              {result.selectedOptionId === result.question.correctOptionId ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-900 mb-3">
                {result.question.text}
              </p>
              
              <div className="mb-3">
                {result.question.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm mb-2",
                      option.id === result.question.correctOptionId 
                        ? "bg-green-50 border border-green-100" 
                        : option.id === result.selectedOptionId && option.id !== result.question.correctOptionId
                          ? "bg-red-50 border border-red-100"
                          : "bg-transparent"
                    )}
                  >
                    <div className="flex items-center">
                      {option.id === result.question.correctOptionId && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 text-green-500">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      )}
                      {option.id === result.selectedOptionId && option.id !== result.question.correctOptionId && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {option.text}
                    </div>
                  </div>
                ))}
              </div>
              
              {result.question.explanation && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="font-medium text-blue-700 mb-1">Explanation:</p>
                  {result.question.explanation}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ResultsDisplay;
