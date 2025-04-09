
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import QuizInterface from '@/components/quiz/QuizInterface';
import ResultsDisplay from '@/components/quiz/ResultsDisplay';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { quizCategories, Question } from '@/utils/quizData';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

const parseJsonResponse = (response: any): Question[] => {
  console.log("API response:", response);
  
  // If the response is already in the expected format, just return it
  if (Array.isArray(response.questions)) {
    return response.questions as Question[];
  }
  
  // If response is in a different format, try to adapt it
  if (response.data && Array.isArray(response.data.questions)) {
    return response.data.questions as Question[];
  }
  
  throw new Error("Unexpected response format from API");
};

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const difficulty = searchParams.get('difficulty') || 'normal';
  const industry = searchParams.get('industry') || 'any';

  // Find the category based on the placeholder quizId or other logic if needed
  const category = quizCategories.find(
    cat => cat.quizzes.some(q => q.id === quizId)
  );

  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null);
  const [quizResults, setQuizResults] = useState<{ question: Question; selectedOptionId: string }[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAndStart = async () => {
    if (!category) {
      toast.error("Category information is missing.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions(null);
    setQuizResults(null);

    const questionCount = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 : 10;
    const level = difficulty === 'easy' ? 'Beginner' : difficulty === 'hard' ? 'Advanced' : 'Intermediate';
    const industryContext = industry === 'any' ? 'General' : industry;

    try {
      const quizParams = {
        category: category.title,
        industry: industryContext,
        level: level,
        num_questions: questionCount
      };
      
      console.log("Sending quiz parameters to API:", quizParams);
      
      // Call our Supabase Edge Function directly
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: quizParams
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.questions) {
        throw new Error("No questions returned from the API");
      }
      
      setGeneratedQuestions(data.questions);
      toast.success("Quiz generated successfully!");
    } catch (err: any) {
      console.error("Error generating quiz:", err);
      setError(`Failed to generate quiz: ${err.message || "Unknown error"}. Please try again.`);
      toast.error("Error generating quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">Could not determine the category for this quiz.</p>
            <Link to="/" className="neo-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const difficultyLabel = {
    'easy': 'Easy',
    'normal': 'Normal',
    'hard': 'Hard'
  }[difficulty] || 'Normal';

  const industryLabel = industry === 'any' ? 'General' : industry.charAt(0).toUpperCase() + industry.slice(1); // Simple capitalization

  const estimatedTime = difficulty === 'easy' ? '~5 min' : difficulty === 'hard' ? '~15 min' : '~10 min';
  const questionCountDisplay = difficulty === 'easy' ? '~5' : difficulty === 'hard' ? '~15' : '~10';

  const quizTitle = `${category.title} Quiz (${difficultyLabel})`;
  const quizDescription = `An AI-generated quiz on ${category.title} focusing on ${industryLabel} context at ${difficultyLabel} difficulty.`;

  const handleQuizComplete = (results: { question: Question; selectedOptionId: string }[]) => {
    setQuizResults(results);
    setGeneratedQuestions(null); // Clear questions when results are shown
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  let content;
  if (quizResults) {
    content = (
      <ResultsDisplay
        results={quizResults}
        categoryId={category.id}
        quizId={quizId}
      />
    );
  } else if (generatedQuestions) {
    content = (
      <QuizInterface
        questions={generatedQuestions}
        onComplete={handleQuizComplete}
      />
    );
  } else if (isGenerating) {
     content = (
       <div className="text-center py-20">
         <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
         <p className="text-lg font-semibold">Generating your quiz...</p>
         <p className="text-muted-foreground">Powered by solveUXQ AI</p>
       </div>
     );
  } else if (error) {
     content = (
       <div className="text-center py-20 max-w-2xl mx-auto">
         <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
         <p className="text-lg font-semibold text-red-600">Error Generating Quiz</p>
         <p className="text-muted-foreground mb-6 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800/50 text-left text-xs break-words">
            <code>{error}</code>
         </p>
         <button
           onClick={handleGenerateAndStart}
           className="neo-button"
         >
           Retry Generation
         </button>
         <div className="mt-4">
            <Link to={`/category/${category.id}`} className="text-sm text-muted-foreground hover:text-primary">
              Back to Category
            </Link>
         </div>
       </div>
     );
  } else {
    content = (
      <div className="container max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/category/${category.id}`)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to {category.title}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedCard className="p-8 rounded-2xl">
            <div className="text-center mb-8">
              <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                {category.title}
              </span>
              <h1 className="text-3xl font-bold mb-4">{quizTitle}</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{quizDescription}</p>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  {questionCountDisplay} Questions (Approx.)
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {estimatedTime}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  {difficultyLabel} Difficulty
                </div>
                 {industry !== 'any' && (
                   <div className="flex items-center text-sm text-gray-500">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-400">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M3 9h18m-9 12h.008v.008H12v-.008Z" />
                     </svg>
                     {industryLabel} Focus
                   </div>
                 )}
              </div>
            </div>

            <div className="text-center">
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-xs max-w-md mx-auto">
                <AlertTriangle className="inline w-4 h-4 mr-1" />
                <strong>Note:</strong> This quiz will be generated by SolveUXQ's backend API.
              </div>
              <button
                onClick={handleGenerateAndStart}
                className="neo-button"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate & Start Quiz
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
               <p className="text-xs text-muted-foreground mt-3">Quiz generated by SolveUXQ API</p>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20">
        {content}
      </div>
    </div>
  );
};

export default QuizPage;
