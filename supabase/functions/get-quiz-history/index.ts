
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
    const { userId, limit = 14 } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client with service role for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Get quiz history data
    const { data, error } = await supabase
      .from('quiz_history_view')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .limit(limit);
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: `Error fetching quiz history: ${error.message}`,
          details: error
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Return the quiz history data
    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in get-quiz-history function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
