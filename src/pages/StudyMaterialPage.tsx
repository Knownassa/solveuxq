
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { getArticleContent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const StudyMaterialPage = () => {
  const { categoryId, articleId } = useParams<{ categoryId: string; articleId: string }>();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      try {
        setIsLoading(true);
        const data = await getArticleContent(articleId);
        setArticle(data);
      } catch (err: any) {
        setError(`Failed to load article. ${err.message}`);
        toast.error("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-6 pt-32 pb-20">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || "Article not found"}</p>
            <Link to={categoryId ? `/study/${categoryId}` : "/study"}>
              <Button>
                Back to Study Materials
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-6">
          <Link 
            to={categoryId ? `/study/${categoryId}` : "/study"}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {categoryId ? decodeURIComponent(categoryId) : "Study Materials"}
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedCard className="p-8 rounded-2xl">
            <article className="prose dark:prose-invert max-w-none">
              <header className="mb-8 not-prose">
                <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </header>
              
              {article.content.startsWith('{') || article.content.startsWith('[') ? (
                // Handle JSON content (from older API)
                <pre className="whitespace-pre-wrap">{article.content}</pre>
              ) : (
                // Handle markdown content
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="whitespace-pre-wrap"
                >
                  {article.content}
                </ReactMarkdown>
              )}
            </article>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
};

export default StudyMaterialPage;
