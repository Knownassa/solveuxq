
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Settings, User, CreditCard, BarChart3 } from 'lucide-react';

const AccountPage = () => {
  const { user } = useUser();
  
  // Mock data for user stats
  const userStats = {
    quizzesCompleted: 23,
    averageScore: 76,
    rank: 3,
    currentPlan: "Free Solver",
    quizzesRemaining: 7,
    streak: 5
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
                      +3 from last week
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
                      +2% from last week
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Daily Quizzes Remaining</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.quizzesRemaining}/10</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Resets at midnight
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
                      <div className="text-sm font-medium">Badges Earned</div>
                      <div className="font-medium">3</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">View Detailed Stats</Button>
                </CardFooter>
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
