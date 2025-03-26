import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Question } from '@/utils/quizData';
import { toast } from 'sonner';

interface QuizInterfaceProps {
  questions: Question[];
  onComplete: (results: { question: Question; selectedOptionId: string }[]) => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<{ question: Question; selectedOptionId: string }[]>([]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOption(optionId);
    }
  };
  
  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error("Please select an answer before continuing");
      return;
    }
    
    setIsSubmitted(true);
    
    // Add to results
    setResults([
      ...results,
      { question: currentQuestion, selectedOptionId: selectedOption }
    ]);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz completed
      onComplete(results);
    }
  };
  
  const isCorrect = selectedOption === currentQuestion.correctOptionId;
  
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <div className="h-1 bg-gray-100 rounded-full flex-grow ml-4 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 rounded-2xl mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.text}
          </h2>
          
          {currentQuestion.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question illustration" 
                className="w-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isSubmitted}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40",
                  selectedOption === option.id 
                    ? "border-primary bg-primary/5" 
                    : "border-gray-200 hover:border-gray-300 bg-white",
                  isSubmitted && option.id === currentQuestion.correctOptionId && "border-green-500 bg-green-50",
                  isSubmitted && selectedOption === option.id && option.id !== currentQuestion.correctOptionId && "border-red-500 bg-red-50"
                )}
              >
                <div className="flex items-start">
                  <div className={cn(
                    "flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mt-0.5",
                    selectedOption === option.id 
                      ? "border-primary" 
                      : "border-gray-300",
                    isSubmitted && option.id === currentQuestion.correctOptionId && "border-green-500",
                    isSubmitted && selectedOption === option.id && option.id !== currentQuestion.correctOptionId && "border-red-500"
                  )}>
                    {selectedOption === option.id && !isSubmitted && (
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                    )}
                    {isSubmitted && option.id === currentQuestion.correctOptionId && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isSubmitted && selectedOption === option.id && option.id !== currentQuestion.correctOptionId && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-3 text-gray-800">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
          
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "mt-6 p-4 rounded-lg",
                isCorrect ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"
              )}
            >
              <p className={cn(
                "font-medium mb-1",
                isCorrect ? "text-green-700" : "text-red-700"
              )}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0 || !isSubmitted}
          className={cn(
            "neo-button-secondary",
            (currentQuestionIndex === 0 || !isSubmitted) && "opacity-50 cursor-not-allowed"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Previous
        </button>
        
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            className="neo-button"
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="neo-button"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;
