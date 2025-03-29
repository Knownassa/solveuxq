
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

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
    const response = await apiClient.get(`/study-materials/article/${articleId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching article ${articleId}:`, error.response?.data || error.message);
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
