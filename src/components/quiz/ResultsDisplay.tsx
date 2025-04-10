
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Question } from '@/utils/quizData';

interface ResultsDisplayProps {
  results: { question: Question; selectedOptionId: string }[];
  categoryId: string;
  quizId: string;
  earnedPoints?: number | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, categoryId, quizId, earnedPoints }) => {
  if (!results || results.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center py-10">
          <p>No results to display.</p>
        </div>
      </div>
    );
  }

  const totalQuestions = results.length;
  const correctAnswers = results.filter(
    result => result.question.correctOptionId === result.selectedOptionId
  ).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="container max-w-4xl mx-auto px-6">
      {earnedPoints && (
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
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card border rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">{score}%</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
            <p className="text-muted-foreground">
              You answered {correctAnswers} out of {totalQuestions} questions correctly.
            </p>
          </div>
        </div>

        <h3 className="font-medium text-lg mb-4">Review Questions</h3>

        <div className="space-y-6 mb-8">
          {results.map((result, index) => {
            const isCorrect = result.question.correctOptionId === result.selectedOptionId;
            const correctOption = result.question.options.find(option => option.id === result.question.correctOptionId);
            const selectedOption = result.question.options.find(option => option.id === result.selectedOptionId);

            return (
              <div key={index} className={`p-5 border rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'}`}>
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${isCorrect ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  <span className="text-xs text-muted-foreground">Question {index + 1}</span>
                </div>
                <h4 className="font-medium mb-3">{result.question.text}</h4>
                
                <div className="space-y-2 mb-3">
                  {result.question.options.map(option => (
                    <div 
                      key={option.id} 
                      className={`p-3 border rounded ${
                        option.id === result.question.correctOptionId
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-900/50' 
                          : option.id === result.selectedOptionId && !isCorrect
                          ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-900/50'
                          : 'bg-background'
                      }`}
                    >
                      {option.text}
                      {option.id === result.question.correctOptionId && (
                        <div className="mt-1 text-xs font-medium text-green-700 dark:text-green-400">
                          Correct answer
                        </div>
                      )}
                      {option.id === result.selectedOptionId && !isCorrect && (
                        <div className="mt-1 text-xs font-medium text-red-700 dark:text-red-400">
                          Your answer
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {!isCorrect && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded text-sm">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-300">Explanation</p>
                        <p className="text-muted-foreground mt-1">
                          The correct answer is "{correctOption?.text}". {result.question.explanation || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsDisplay;
