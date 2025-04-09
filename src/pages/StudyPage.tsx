
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useApiAuth, getStudyMaterialCategories, getStudyMaterialsByCategory, generateStudyMaterial, saveStudyMaterial } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, BookOpen, Plus, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudyPage = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { authGet } = useApiAuth();

  // Form states for generating new study material
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterial, setGeneratedMaterial] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getStudyMaterialCategories();
        setCategories(data.categories || []);
        
        // If categoryId is provided in the URL and valid, select that category
        if (categoryId && data.categories && data.categories.includes(decodeURIComponent(categoryId))) {
          setSelectedCategory(decodeURIComponent(categoryId));
        }
      } catch (err) {
        setError("Failed to load study material categories. Please try again later.");
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [categoryId]);

  // Fetch materials when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchMaterialsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchMaterialsByCategory = async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getStudyMaterialsByCategory(category);
      setMaterials(data.materials || []);
    } catch (err) {
      setError(`Failed to load study materials for ${category}. Please try again later.`);
      toast.error(`Failed to load materials for ${category}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Update URL to reflect the selected category
    navigate(`/study/${encodeURIComponent(category)}`);
  };

  const handleGenerateStudyMaterial = async () => {
    if (!topic.trim() || !selectedCategory) {
      toast.error("Please enter a topic and select a category");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateStudyMaterial(selectedCategory, topic, length);
      setGeneratedMaterial(result);
      toast.success("Study material generated successfully!");
    } catch (err: any) {
      toast.error(`Failed to generate study material: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStudyMaterial = async () => {
    if (!generatedMaterial) return;

    setIsSaving(true);
    try {
      await saveStudyMaterial(
        generatedMaterial.title,
        generatedMaterial.content,
        selectedCategory!
      );
      
      // Refresh materials list
      fetchMaterialsByCategory(selectedCategory!);
      
      // Reset form
      setGeneratedMaterial(null);
      setTopic('');
      setOpen(false);
      
      toast.success("Study material saved successfully!");
    } catch (err: any) {
      toast.error(`Failed to save study material: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
          
          {selectedCategory && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Generate New Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Generate New Study Material</DialogTitle>
                  <DialogDescription>
                    Enter a topic to generate new study material using AI. The content will be related to {selectedCategory}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium">Topic</label>
                    <Input
                      id="topic"
                      placeholder="e.g., Card Sorting Techniques"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="length" className="text-sm font-medium">Content Length</label>
                    <Select
                      value={length}
                      onValueChange={(value: any) => setLength(value)}
                    >
                      <SelectTrigger id="length">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (~300-500 words)</SelectItem>
                        <SelectItem value="medium">Medium (~800-1200 words)</SelectItem>
                        <SelectItem value="long">Long (~1500-2500 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {generatedMaterial && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{generatedMaterial.title}</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1"
                          onClick={handleSaveStudyMaterial}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Save
                        </Button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 bg-slate-50 dark:bg-slate-950">
                        <pre className="whitespace-pre-wrap">{generatedMaterial.content}</pre>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  {!generatedMaterial ? (
                    <Button 
                      onClick={handleGenerateStudyMaterial} 
                      disabled={isGenerating || !topic.trim()}
                      className="gap-2"
                    >
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setGeneratedMaterial(null)}
                    >
                      Generate Another
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {isLoading && !selectedCategory ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading study materials...</p>
          </div>
        ) : error && !selectedCategory ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {!selectedCategory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <CardHeader>
                        <CardTitle>{category}</CardTitle>
                        <CardDescription>Explore study materials about {category} to enhance your UX knowledge.</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <div className="text-primary hover:underline inline-flex items-center">
                          Browse materials
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Button variant="ghost" onClick={() => navigate('/study')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    All Categories
                  </Button>
                  <h2 className="text-2xl font-semibold">{selectedCategory} Materials</h2>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>Loading {selectedCategory} materials...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => fetchMaterialsByCategory(selectedCategory)}>
                      Try Again
                    </Button>
                  </div>
                ) : materials.length > 0 ? (
                  <div className="space-y-6">
                    {materials.map((material, index) => (
                      <motion.div
                        key={material.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>{material.title}</CardTitle>
                            <CardDescription>
                              Added on {new Date(material.created_at).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-3 text-muted-foreground">
                              {material.content.substring(0, 200)}...
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Link to={`/study/${encodeURIComponent(selectedCategory)}/${material.id}`} className="inline-flex items-center text-primary">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Read Full Article
                            </Link>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No study materials available for {selectedCategory} yet.</p>
                    <p className="text-sm mb-6">Generate new content with AI or check back later!</p>
                    <Button onClick={() => setOpen(true)}>
                      <Plus size={16} className="mr-2" />
                      Generate New Material
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudyPage;
