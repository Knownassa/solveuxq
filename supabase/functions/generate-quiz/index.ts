
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
    // Log incoming request to help with debugging
    console.log("Received quiz generation request");
    
    // Validate API key
    if (!OPENROUTER_API_KEY) {
      console.error("Missing OpenRouter API key");
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { category, industry, level, num_questions } = requestData;
    
    if (!category || !level || !num_questions) {
      console.error("Missing required parameters:", { category, industry, level, num_questions });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: category, level, or num_questions' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating quiz: ${category}, ${industry || 'general knowledge'}, ${level}, ${num_questions} questions`);

    // Simplified prompt for faster generation
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
          "explanation": "Brief explanation"
        },
        ... more questions
      ]
    }
    
    Make the questions concise and direct. Return just the JSON, nothing else.`;

    console.log("Calling OpenRouter API...");
    
    // Call OpenRouter API with better error handling and reduced timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout (reduced from 60)
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://solveuxq.vercel.app", 
          "X-Title": "SolveUXQ", 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.5-pro-exp-03-25:free", 
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ],
          "temperature": 0.3, // Lower temperature for faster, more predictable responses
          "max_tokens": 3000 // Slightly reduced token count for faster responses
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Check HTTP status and handle errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API Error (${response.status}):`, errorText);
        
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
        } catch {
          errorMessage = `API request failed with status ${response.status}: ${errorText}`;
        }
        
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Parse OpenRouter response
      const data = await response.json();
      console.log("Received response from OpenRouter");
      
      // Extract the content from the first choice's message
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        console.error("Unexpected API response format:", JSON.stringify(data));
        return new Response(
          JSON.stringify({ error: "Could not extract content from API response" }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const content = data.choices[0].message.content;
      console.log("Extracted content from OpenRouter response");
      
      // Parse the JSON content from the response
      try {
        // The AI might include markdown code blocks or other text, so we need to extract just the JSON
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || [null, content];
        const jsonContent = jsonMatch[1] || content;
        
        // Try to parse the JSON
        const parsedQuiz = JSON.parse(jsonContent.trim());
        
        if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions)) {
          console.error("Invalid quiz format - missing questions array:", parsedQuiz);
          return new Response(
            JSON.stringify({ error: "Invalid quiz format generated" }),
            { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`Successfully generated ${parsedQuiz.questions.length} questions`);
        
        return new Response(
          JSON.stringify(parsedQuiz),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error("Error parsing JSON from AI response:", parseError);
        console.log("Raw content:", content);
        
        // Return a more detailed error for debugging
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse quiz data", 
            details: parseError.message,
            rawContentPreview: content.substring(0, 500) + (content.length > 500 ? '...' : '') 
          }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      console.error("Fetch error calling OpenRouter:", fetchError);
      return new Response(
        JSON.stringify({ 
          error: fetchError.name === 'AbortError' 
            ? 'Request timed out after 45 seconds' 
            : `Fetch error: ${fetchError.message}` 
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error("Unexpected error in generate-quiz function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
