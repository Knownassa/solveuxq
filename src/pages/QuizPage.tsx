import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import QuizInterface from '@/components/quiz/QuizInterface';
import ResultsDisplay from '@/components/quiz/ResultsDisplay';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { quizCategories, Question } from '@/utils/quizData'; // Assuming Question type is defined here
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';

// Updated helper function to parse JSON potentially wrapped in markdown or with surrounding text
const parseJsonResponse = (text: string): any => {
  console.log("Attempting to parse raw text:", text); // Log the raw text received

  // Attempt 1: Try direct parsing (ideal case)
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    console.warn("Direct JSON parsing failed. Trying to extract from markdown.");
  }

  // Attempt 2: Extract from markdown code blocks
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    const extractedJson = jsonMatch[1].trim();
    console.log("Extracted JSON from markdown:", extractedJson);
    try {
      // Try parsing the extracted content
      return JSON.parse(extractedJson);
    } catch (error) {
      console.error("Failed to parse JSON extracted from markdown:", error, "Extracted text:", extractedJson);
      // Fall through to final attempt
    }
  } else {
     console.warn("No markdown JSON block found. Checking for JSON object boundaries.");
  }

   // Attempt 3: Find the first '{' and last '}' - less reliable, but might catch JSON embedded in other text
   const firstBrace = text.indexOf('{');
   const lastBrace = text.lastIndexOf('}');
   if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
     const potentialJson = text.substring(firstBrace, lastBrace + 1).trim();
     console.log("Potential JSON extracted by brace matching:", potentialJson);
     try {
       return JSON.parse(potentialJson);
     } catch (error) {
       console.error("Failed to parse JSON extracted by brace matching:", error, "Potential JSON:", potentialJson);
     }
   }

  // If all attempts fail
  console.error("All JSON parsing attempts failed for raw text:", text);
  throw new Error("Invalid JSON format received from API after multiple parsing attempts.");
};


const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  // IMPORTANT: Replace with secure handling (e.g., backend proxy) in production
  const OPENROUTER_API_KEY = "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"; // Your Openrouter API Key
  const GEMINI_MODEL = "google/gemini-2.0-pro-exp-02-05:free"; // Using the latest flash model (confirm if user meant another)

  const handleGenerateAndStart = async () => {
    if (!category) {
      toast.error("Category information is missing.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions(null); // Clear previous questions
    setQuizResults(null); // Clear previous results

    const questionCount = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 : 10;
    const industryContext = industry === 'any' ? 'general user experience principles' : `user experience within the ${industry} industry`;

    // Updated prompt structure for clarity and JSON focus
    const prompt = `Generate a ${difficulty} level quiz about ${category.title} focusing on ${industryContext}.
      Provide exactly ${questionCount} multiple-choice questions.
      Each question must have:
      - "id": A unique string identifier (e.g., "q1_ux_basics").
      - "text": The question text.
      - "options": An array of exactly 4 objects, each with a unique "id" (string) and "text" (string).
      - "correctOptionId": The "id" string of the correct option from the "options" array.
      - "explanation": A brief explanation for why the correct answer is right.

      Output ONLY the valid JSON object containing a single key "questions" which is an array of these question objects. Do NOT include markdown formatting like \`\`\`json or any other text outside the JSON structure. Ensure the JSON is strictly valid (e.g., no trailing commas).

      Example of a single question object within the "questions" array:
      {
        "id": "q1_example",
        "text": "What is a primary goal of UX?",
        "options": [
          { "id": "opt1", "text": "Visuals" },
          { "id": "opt2", "text": "Usability" },
          { "id": "opt3", "text": "Code" },
          { "id": "opt4", "text": "Marketing" }
        ],
        "correctOptionId": "opt2",
        "explanation": "Usability is key to a good user experience."
      }`;

    try {
      console.log("Sending prompt to Openrouter:", prompt);

      const API_URL = "https://openrouter.ai/api/v1/chat/completions";

      const requestBody = {
        "model": "google/gemini-2.0-pro-exp-02-05:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      };

      console.log("Request URL:", API_URL);
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173", // Replace with your actual site URL in production
          "X-Title": "solveUXQ", // Replace with your actual site name in production
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Received response status:", response.status);

      if (!response.ok) {
        // Attempt to read error body as text first, then try JSON
        let errorPayload: any = null;
        try {
            errorPayload = await response.json();
            console.error("API Error JSON Body:", errorPayload);
        } catch (jsonError) {
            console.warn("Could not parse API error response as JSON. Reading as text.");
            try {
                const errorText = await response.text();
                console.error("API Error Text Body:", errorText);
                errorPayload = { error: { message: errorText } }; // Create a similar structure
            } catch (textError) {
                console.error("Could not read API error response as text either.");
            }
        }
        const errorMessage = errorPayload?.error?.message || `HTTP error ${response.status}`;
        throw new Error(`API Error: ${errorMessage}`);
      }

      const data = await response.json();
      console.log("Received API data object:", data); // Log the full data object

      // --- Adjust response handling for Openrouter ---
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
        console.error("Invalid response structure from Openrouter API:", data);
        throw new Error("Invalid response structure from Openrouter API.");
      }

      const rawContent = data.choices[0].message.content;
      // CRITICAL: Log the raw content BEFORE parsing
      console.log("Raw content string from API:", JSON.stringify(rawContent)); // Stringify to see whitespace/special chars

      const parsedData = parseJsonResponse(rawContent); // Use the updated parser
      console.log("Parsed JSON data:", parsedData);

      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
         console.error("Parsed data missing 'questions' array:", parsedData);
         throw new Error("API response, after parsing, does not contain a valid 'questions' array.");
      }
      // --- End of Openrouter specific handling ---


      // Basic validation of question structure (can be expanded)
      const isValidQuestions = parsedData.questions.every((q: any) =>
        q.id && q.text && Array.isArray(q.options) && q.options.length > 0 && q.correctOptionId && q.explanation &&
        q.options.every((opt: any) => opt.id && opt.text)
      );

      if (!isValidQuestions) {
        console.error("Invalid question structure in API response:", parsedData.questions);
        throw new Error("Received invalid question structure from API.");
      }


      setGeneratedQuestions(parsedData.questions as Question[]);
      toast.success("Quiz generated successfully!");

    } catch (err: any) {
      console.error("Error generating quiz:", err);
      // Ensure the full error message from the catch block is displayed
      setError(`Failed to generate quiz. ${err.message}. Please check the console for more details.`);
      toast.error("Error generating quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ... (rest of the component remains the same)

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

  // Determine labels based on query params
  const difficultyLabel = {
    'easy': 'Easy',
    'normal': 'Normal',
    'hard': 'Hard'
  }[difficulty] || 'Normal';

  const industryLabel = industry === 'any' ? 'General' : industry.charAt(0).toUpperCase() + industry.slice(1); // Simple capitalization

  // Placeholder values (can be adjusted or removed if not needed for display)
  const estimatedTime = difficulty === 'easy' ? '~5 min' : difficulty === 'hard' ? '~15 min' : '~10 min';
  const questionCountDisplay = difficulty === 'easy' ? '~5' : difficulty === 'hard' ? '~15' : '~10';

  // Use category title and description, incorporating difficulty/industry
  const quizTitle = `${category.title} Quiz (${difficultyLabel})`;
  const quizDescription = `An AI-generated quiz on ${category.title} focusing on ${industryLabel} context at ${difficultyLabel} difficulty.`;


  const handleQuizComplete = (results: { question: Question; selectedOptionId: string }[]) => {
    setQuizResults(results);
    setGeneratedQuestions(null); // Clear questions when results are shown
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Decide what content to show: Initial details, Loading, Error, Quiz, or Results
  let content;
  if (quizResults) {
    content = (
      <ResultsDisplay
        results={quizResults}
        categoryId={category.id}
        quizId={quizId} // Pass the placeholder quizId used to start
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
         {/* Display the full error message */}
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
    // Initial state: Show quiz details and Generate button
    content = (
      <div className="container max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/category/${category.id}`)} // Navigate back to the category page
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
                     {/* Placeholder for industry icon */}
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-400">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M3 9h18m-9 12h.008v.008H12v-.008Z" />
                     </svg>
                     {industryLabel} Focus
                   </div>
                 )}
              </div>
            </div>

            <div className="text-center">
              {/* Security Warning */}
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-xs max-w-md mx-auto">
                <AlertTriangle className="inline w-4 h-4 mr-1" />
                <strong>Alpha Version:</strong> This is an alpha version (0.1.0) using solveUXQ AI.
              </div>
              <button
                onClick={handleGenerateAndStart} // This button now triggers the API call
                className="neo-button"
                disabled={isGenerating} // Disable while generating
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
               <p className="text-xs text-muted-foreground mt-3">Quiz generated by solveUXQ AI</p>
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
