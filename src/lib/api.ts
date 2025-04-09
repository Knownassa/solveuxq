
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

// Get the base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://solveuxqback-ec623eb49773.herokuapp.com/api/v1';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook for using authenticated API requests
export const useApiAuth = () => {
  const { getToken } = useAuth();
  
  // Function to get headers with auth token
  const getAuthHeaders = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  };
  
  // Authenticated GET request
  const authGet = async (endpoint: string) => {
    const headers = await getAuthHeaders();
    return apiClient.get(endpoint, { headers });
  };
  
  // Authenticated POST request
  const authPost = async (endpoint: string, data: any) => {
    const headers = await getAuthHeaders();
    return apiClient.post(endpoint, data, { headers });
  };
  
  return {
    authGet,
    authPost,
    getAuthHeaders,
  };
};

// Common API functions that don't require authentication
export const getStudyMaterialCategories = async () => {
  try {
    // Try to get categories from Supabase first
    const { data: supabaseData, error } = await supabase
      .from('study_material_categories')
      .select('*')
      .order('name');
    
    if (!error && supabaseData && supabaseData.length > 0) {
      return { categories: supabaseData.map(cat => cat.name) };
    }
    
    // Fall back to the original API if Supabase data is not available
    const response = await apiClient.get('/study-materials/categories');
    return response.data;
  } catch (error: any) {
    console.error("Error fetching study material categories:", error.response?.data || error.message);
    throw error;
  }
};

// API functions that require authentication
export const generateQuiz = async (quizParams: any, authToken: string) => {
  try {
    const response = await apiClient.post('/quiz/generate', quizParams, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error generating quiz:", error.response?.data || error.message);
    throw error;
  }
};

// Function to get study materials by category
export const getStudyMaterialsByCategory = async (category: string) => {
  try {
    // Try to get study materials from Supabase first
    const { data: categoryData, error: categoryError } = await supabase
      .from('study_material_categories')
      .select('id')
      .eq('name', category)
      .single();
    
    if (!categoryError && categoryData) {
      const { data: materials, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('created_at', { ascending: false });
      
      if (!error && materials) {
        return { materials };
      }
    }
    
    // Fall back to the original API if Supabase data is not available
    const response = await apiClient.get(`/study-materials/category/${category}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching study materials for ${category}:`, error.response?.data || error.message);
    throw error;
  }
};

// Get article content
export const getArticleContent = async (articleId: string) => {
  try {
    // Try to get study material from Supabase first
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .eq('id', articleId)
      .single();
    
    if (!error && data) {
      return data;
    }
    
    // Fall back to the original API if Supabase data is not available
    const response = await apiClient.get(`/study-materials/article/${articleId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching article ${articleId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Generate study material using AI
export const generateStudyMaterial = async (category: string, topic: string, length: 'short' | 'medium' | 'long' = 'medium') => {
  try {
    const response = await fetch(`https://drgjgkroprkycxdjuknr.supabase.co/functions/v1/generate-study-material`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, topic, length }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error(`Error generating study material:`, error.message);
    throw error;
  }
};

// Save study material to Supabase
export const saveStudyMaterial = async (title: string, content: string, category: string) => {
  try {
    const response = await fetch(`https://drgjgkroprkycxdjuknr.supabase.co/functions/v1/save-study-material`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, category }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error(`Error saving study material:`, error.message);
    throw error;
  }
};

// Get user subscription info
export const getUserSubscription = async (authToken: string) => {
  try {
    const response = await apiClient.get('/user/subscription', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user subscription:", error.response?.data || error.message);
    throw error;
  }
};
