
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Get the API key from environment variables
const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

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
    // Parse the request body
    const { category, topic, length = 'medium' } = await req.json();
    
    if (!category || !topic) {
      return new Response(
        JSON.stringify({ error: 'Category and topic are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Define word count based on requested length
    let wordCount;
    switch (length) {
      case 'short': wordCount = '300-500'; break;
      case 'medium': wordCount = '800-1200'; break;
      case 'long': wordCount = '1500-2500'; break;
      default: wordCount = '800-1200';
    }
    
    // Create the prompt for the AI
    const prompt = `
      Generate an educational study material about ${topic} in the field of ${category}. 
      Focus on providing practical insights, examples, and best practices.
      The content should be between ${wordCount} words, well-structured with clear headings and paragraphs.
      Format the content in Markdown.
      Make sure to include:
      - An engaging introduction
      - Core concepts explained clearly
      - Practical examples or case studies
      - Best practices and tips
      - A brief summary or conclusion
    `;
    
    console.log(`Generating study material for ${category}: ${topic}`);
    
    // Make request to OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterApiKey}`,
        "HTTP-Referer": "https://solveuxq.vercel.app",
        "X-Title": "SolveUXQ Study Material Generator",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the generated content
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const generatedContent = data.choices[0].message.content;
      
      // Create a title based on the topic
      const title = `${topic.charAt(0).toUpperCase() + topic.slice(1)} - ${category} Guide`;
      
      return new Response(
        JSON.stringify({ 
          title, 
          content: generatedContent,
          category,
          topic 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Could not extract content from API response");
    }
  } catch (error) {
    console.error("Error in generate-study-material function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
