
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get OpenRouter API key from environment
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, industry, level, num_questions } = await req.json();
    
    if (!category || !level || !num_questions) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating quiz: ${category}, ${industry}, ${level}, ${num_questions} questions`);

    // Construct the prompt for quiz generation
    const prompt = `Generate a quiz about ${category} with focus on ${industry || 'general knowledge'} 
    at ${level} level with exactly ${num_questions} questions.
    
    Each question should have 4 options with ONE correct answer. 
    
    Format the response as a JSON object with the following structure:
    {
      "questions": [
        {
          "id": "q1",
          "text": "Question text here?",
          "options": [
            {"id": "a", "text": "Option A"},
            {"id": "b", "text": "Option B"},
            {"id": "c", "text": "Option C"},
            {"id": "d", "text": "Option D"}
          ],
          "correctOptionId": "a",
          "explanation": "Explanation of why this is the correct answer"
        },
        ... more questions
      ]
    }
    
    Make sure the quiz is challenging but fair. Do not add any commentary before or after the JSON.`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://solveuxq.vercel.app", 
        "X-Title": "SolveUXQ", 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-pro-exp-03-25:free", // Using Gemini as requested
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "temperature": 0.7,
        "max_tokens": 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the content from the first choice's message
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const content = data.choices[0].message.content;
      
      // Parse the JSON content from the response
      try {
        // The AI might include markdown code blocks or other text, so we need to extract just the JSON
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || [null, content];
        const jsonContent = jsonMatch[1] || content;
        
        // Try to parse the JSON
        const parsedQuiz = JSON.parse(jsonContent.trim());
        
        console.log(`Successfully generated ${parsedQuiz.questions?.length || 0} questions`);
        
        return new Response(
          JSON.stringify(parsedQuiz),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error("Error parsing JSON from AI response:", parseError);
        console.log("Raw content:", content);
        
        // If we can't parse it as JSON, return the raw content for debugging
        return new Response(
          JSON.stringify({ error: "Failed to parse quiz data", rawContent: content }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      throw new Error("Could not extract content from API response");
    }
  } catch (error) {
    console.error("Error in generate-quiz function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
