
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Settings, User, CreditCard, BarChart3, TrendingUp } from 'lucide-react';
import { ChartContainer } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CategoryProgress {
  category_name: string;
  score: number;
  quizzes_completed: number;
}

interface QuizHistory {
  date: string;
  points: number;
  score: number;
}

interface UserStats {
  quizzes_completed: number;
  average_score: number;
  total_points: number;
  rank: number;
  daily_quizzes: number;
  streak: number;
}

const AccountPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [userStats, setUserStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalPoints: 0,
    rank: 0,
    currentPlan: "Free Solver",
    quizzesRemaining: 7,
    streak: 0
  });

  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if the user is logged in
    if (userId) {
      fetchUserStats();
    }
  }, [userId]);

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      // Fetch user stats from the Edge Function
      const response = await fetch('https://drgjgkroprkycxdjuknr.supabase.co/functions/v1/get-user-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching user stats: ${response.statusText}`);
      }
      
      const statsData = await response.json();
      
      // Get category progress data
      const { data: progressData, error: progressError } = await supabase
        .from('category_progress_view')
        .select('*')
        .eq('user_id', userId);
      
      if (progressError) {
        console.error("Error fetching category progress:", progressError);
        toast({
          title: "Error",
          description: "Failed to load category progress data",
          variant: "destructive"
        });
      }
      
      // Get quiz history with Supabase
      const { data: historyData, error: historyError } = await supabase
        .from('quiz_history_view')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .limit(14);
      
      if (historyError) {
        console.error("Error fetching quiz history:", historyError);
        toast({
          title: "Error",
          description: "Failed to load quiz history data",
          variant: "destructive"
        });
      }
      
      // Update state with the fetched data
      if (statsData) {
        setUserStats({
          quizzesCompleted: statsData.quizzes_completed || 0,
          averageScore: statsData.average_score || 0,
          totalPoints: statsData.total_points || 0,
          rank: statsData.rank || 0,
          currentPlan: "Free Solver", // This could come from a subscription table in the future
          quizzesRemaining: 10 - (statsData.daily_quizzes || 0),
          streak: statsData.streak || 0
        });
      }
      
      if (progressData) {
        setCategoryProgress(progressData.map((item: any) => ({
          category_name: item.category_name,
          score: item.average_score || 0,
          quizzes_completed: item.quizzes_completed || 0
        })));
      }
      
      if (historyData) {
        setQuizHistory(historyData.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          points: item.points_earned || 0,
          score: item.score_percentage || 0
        })));
      }
    } catch (error) {
      console.error("Error in data fetching:", error);
      toast({
        title: "Error",
        description: "Failed to load account data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground">Manage your account settings and view your progress</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {userStats.currentPlan}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.quizzesCompleted}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep learning to improve your knowledge
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.averageScore}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all quizzes taken
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Earn more by completing quizzes
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Your learning journey so far</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Current Rank</div>
                      <div className="font-medium">#{userStats.rank}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Current Streak</div>
                      <div className="font-medium">{userStats.streak} days</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Daily Quizzes Remaining</div>
                      <div className="font-medium">{userStats.quizzesRemaining}/10</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">View Detailed Stats</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Knowledge Areas</CardTitle>
                    <CardDescription>Your performance across different categories</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-[300px] w-full">
                      {!isLoading && categoryProgress.length > 0 ? (
                        <ChartContainer 
                          config={{ 
                            score: { 
                              theme: { 
                                light: "#0ea5e9", 
                                dark: "#38bdf8" 
                              } 
                            },
                            quizzes: { 
                              theme: { 
                                light: "#8b5cf6", 
                                dark: "#a78bfa" 
                              } 
                            }
                          }}
                        >
                          <RadarChart data={categoryProgress}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="category_name" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                              name="Score (%)"
                              dataKey="score"
                              stroke="var(--color-score)"
                              fill="var(--color-score)"
                              fillOpacity={0.3}
                            />
                            <Tooltip />
                            <Legend />
                          </RadarChart>
                        </ChartContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          {isLoading ? (
                            <p>Loading data...</p>
                          ) : (
                            <p className="text-muted-foreground text-center">
                              No category data available yet.
                              <br />
                              Complete some quizzes to see your performance!
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Your quiz scores over time</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-[300px] w-full">
                      {!isLoading && quizHistory.length > 0 ? (
                        <ChartContainer 
                          config={{ 
                            score: { 
                              theme: { 
                                light: "#0ea5e9", 
                                dark: "#38bdf8" 
                              } 
                            },
                            points: { 
                              theme: { 
                                light: "#8b5cf6", 
                                dark: "#a78bfa" 
                              } 
                            }
                          }}
                        >
                          <LineChart data={quizHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="score"
                              name="Score (%)"
                              stroke="var(--color-score)"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="points"
                              name="Points"
                              stroke="var(--color-points)"
                            />
                          </LineChart>
                        </ChartContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          {isLoading ? (
                            <p>Loading data...</p>
                          ) : (
                            <p className="text-muted-foreground text-center">
                              No history data available yet.
                              <br />
                              Complete some quizzes to see your progress!
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Categories Mastery</CardTitle>
                  <CardDescription>Your progress in different subject areas</CardDescription>
                </CardHeader>
                <CardContent>
                  {!isLoading && categoryProgress.length > 0 ? (
                    <div className="space-y-4">
                      {categoryProgress.map((category) => (
                        <div key={category.category_name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{category.category_name}</div>
                            <div className="text-sm text-muted-foreground">{category.score}% mastery</div>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-primary" 
                              style={{ width: `${category.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {category.quizzes_completed} quizzes completed
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      {isLoading ? (
                        <p>Loading mastery data...</p>
                      ) : (
                        <>
                          <p className="text-muted-foreground mb-4">
                            You haven't completed any quizzes yet.
                          </p>
                          <Button>Take Your First Quiz</Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your public profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                      {user?.firstName?.charAt(0) || ''}
                      {user?.lastName?.charAt(0) || ''}
                    </div>
                    <div>
                      <h3 className="font-medium">{user?.firstName} {user?.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Update Profile Picture</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Current Plan: {userStats.currentPlan}</h3>
                        <p className="text-sm text-muted-foreground">10 quizzes per day</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                  
                  <Alert className="bg-yellow-50 border-yellow-100 dark:bg-yellow-950/20 dark:border-yellow-900/50">
                    <InfoIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <AlertTitle>Paid Challenger Plan Coming Soon!</AlertTitle>
                    <AlertDescription>
                      Get ready for our premium plan with 50 quizzes per day, advanced analytics, and more. 
                      Stay tuned for updates.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button disabled className="w-full">Upgrade to Paid Challenger (Coming Soon)</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive quiz updates and news</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;
