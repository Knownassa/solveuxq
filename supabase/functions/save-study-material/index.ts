
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

// Get Supabase credentials from environment variables
const supabaseUrl = 'https://drgjgkroprkycxdjuknr.supabase.co';
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Parse the request body
    const { title, content, category } = await req.json();
    
    if (!title || !content || !category) {
      return new Response(
        JSON.stringify({ error: 'Title, content, and category are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get category id first
    const { data: categoryData, error: categoryError } = await supabase
      .from('study_material_categories')
      .select('id')
      .eq('name', category)
      .single();
    
    if (categoryError) {
      if (categoryError.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Category not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw categoryError;
    }
    
    // Insert the study material
    const { data, error } = await supabase
      .from('study_materials')
      .insert([
        { 
          title, 
          content, 
          category_id: categoryData.id
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ success: true, material: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in save-study-material function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
