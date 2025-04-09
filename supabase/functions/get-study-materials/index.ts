
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
    
    // Get category from URL
    const url = new URL(req.url);
    const categoryName = url.pathname.split('/').pop();
    
    if (!categoryName) {
      // If no category specified, return all categories
      const { data: categories, error } = await supabase
        .from('study_material_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ categories }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Get category id first
      const { data: category, error: categoryError } = await supabase
        .from('study_material_categories')
        .select('id')
        .eq('name', categoryName)
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
      
      // Get study materials for the category
      const { data: materials, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ materials }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in get-study-materials function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
