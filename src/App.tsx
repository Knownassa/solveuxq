
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/clerk-react";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import QuizPage from "./pages/QuizPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import StudyPage from "./pages/StudyPage";
import StudyMaterialPage from "./pages/StudyMaterialPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PricingPage from "./pages/PricingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AccountPage from "./pages/AccountPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ClerkLoading>
          <div className="h-screen w-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Auth Routes - Use wildcards to support Clerk's routing patterns */}
            <Route path="/sign-in/*" element={
              <>
                <SignedIn>
                  <Navigate to="/study" replace />
                </SignedIn>
                <SignedOut>
                  <SignInPage />
                </SignedOut>
              </>
            } />
            <Route path="/sign-up/*" element={
              <>
                <SignedIn>
                  <Navigate to="/study" replace />
                </SignedIn>
                <SignedOut>
                  <SignUpPage />
                </SignedOut>
              </>
            } />
            
            {/* Protected Routes */}
            <Route path="/quizzes" element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            } />
            <Route path="/category/:categoryId" element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:quizId" element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } />
            <Route path="/study" element={
              <ProtectedRoute>
                <StudyPage />
              </ProtectedRoute>
            } />
            <Route path="/study/:categoryId" element={
              <ProtectedRoute>
                <StudyPage />
              </ProtectedRoute>
            } />
            <Route path="/study/:categoryId/:articleId" element={
              <ProtectedRoute>
                <StudyMaterialPage />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } />
            
            {/* This catch-all route is crucial for handling Clerk redirects */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClerkLoaded>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
