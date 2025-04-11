
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Get Supabase credentials from environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
    const { userId, categoryId, level } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client with service role for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Prepare query based on parameters
    let query = supabase.from('category_progress_view').select('*');
    
    // Apply filters based on provided parameters
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    // Get category progress data
    const { data: progressData, error: progressError } = await query;
    
    if (progressError) {
      return new Response(
        JSON.stringify({ 
          error: `Error fetching category progress: ${progressError.message}`,
          details: progressError
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If there's a specific categoryId and level, fetch quizzes for that category/level
    let quizData = null;
    let quizError = null;
    
    if (categoryId && level !== undefined) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, quiz_options(*)')
        .eq('category_id', categoryId)
        .eq('level', level)
        .order('position', { ascending: true });
      
      quizData = data;
      quizError = error;
      
      if (quizError) {
        return new Response(
          JSON.stringify({ 
            error: `Error fetching quizzes: ${quizError.message}`,
            details: quizError
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Return the data
    return new Response(
      JSON.stringify({ 
        progress: progressData,
        quizzes: quizData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in get-category-progress function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
