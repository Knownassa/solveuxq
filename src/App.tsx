
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import QuizPage from "./pages/QuizPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import StudyPage from "./pages/StudyPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quizzes" element={<CategoriesPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ClerkLoaded>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
