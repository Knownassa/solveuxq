
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Get Supabase credentials from environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
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
    const { results, categoryId, userId } = await req.json();
    
    if (!results || !Array.isArray(results) || !userId || !categoryId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: results, categoryId, or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate points based on correct answers
    const correctAnswers = results.filter(
      result => result.question.correctOptionId === result.selectedOptionId
    ).length;
    
    const totalQuestions = results.length;
    const percentageCorrect = (correctAnswers / totalQuestions) * 100;
    
    // Calculate points - base points plus bonus for high percentage
    let points = correctAnswers * 10; // Base points (10 per correct answer)
    
    // Bonus points for high percentage correct
    if (percentageCorrect >= 90) {
      points += 50; // Excellence bonus
    } else if (percentageCorrect >= 75) {
      points += 25; // Good performance bonus
    } else if (percentageCorrect >= 50) {
      points += 10; // Passing bonus
    }
    
    // Create Supabase client with service role for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Record the quiz attempt in the database
    const { data: attemptData, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        category_id: categoryId,
        score_percentage: percentageCorrect,
        points_earned: points,
        total_questions: totalQuestions,
        correct_answers: correctAnswers
      })
      .select()
      .single();
    
    if (attemptError) {
      console.error("Error recording quiz attempt:", attemptError);
      return new Response(
        JSON.stringify({ 
          error: `Failed to record quiz attempt: ${attemptError.message}`,
          details: attemptError
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Update user's total points
    const { data: userData, error: userError } = await supabase
      .rpc('increment_user_points', { 
        user_id_param: userId, 
        points_to_add: points 
      });
    
    if (userError) {
      console.error("Error updating user points:", userError);
      return new Response(
        JSON.stringify({ 
          error: `Failed to update user points: ${userError.message}`,
          details: userError
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get category statistics for this user
    const { data: categoryStats, error: statsError } = await supabase
      .from('category_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .single();
    
    // Return the updated data to the client
    return new Response(
      JSON.stringify({ 
        success: true,
        points: points,
        attempt: attemptData,
        categoryStats: categoryStats || null,
        totalPoints: userData?.new_points || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in quiz-points function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
