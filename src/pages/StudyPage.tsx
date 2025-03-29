
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useApiAuth, getStudyMaterialCategories } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const StudyPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authGet } = useApiAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getStudyMaterialCategories();
        setCategories(data.categories || []);
      } catch (err) {
        setError("Failed to load study material categories. Please try again later.");
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Study Materials</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading study materials...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <div 
                    key={index} 
                    className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-4">{category}</h3>
                    <p className="text-muted-foreground mb-4">Explore study materials about {category} to enhance your UX knowledge.</p>
                    <Link 
                      to={`/study/${encodeURIComponent(category)}`} 
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      Browse materials
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No study materials are available yet.</p>
                <p className="text-sm">Check back soon as we're constantly adding new content!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPage;
