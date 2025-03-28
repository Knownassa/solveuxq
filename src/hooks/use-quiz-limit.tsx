
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface QuizLimitState {
  quizzesUsedToday: number;
  quizzesRemaining: number;
  hasReachedLimit: boolean;
  incrementUsage: () => void;
  resetUsage: () => void;
}

const FREE_PLAN_LIMIT = 10;
const PAID_PLAN_LIMIT = 50;

export const useQuizLimit = (): QuizLimitState => {
  const { user, isSignedIn } = useUser();
  const [quizzesUsedToday, setQuizzesUsedToday] = useState<number>(0);
  
  // For now, everyone is on free plan (paid is coming soon)
  const isPaidUser = false;
  const dailyLimit = isPaidUser ? PAID_PLAN_LIMIT : FREE_PLAN_LIMIT;

  useEffect(() => {
    if (!isSignedIn) return;

    // Attempt to load usage from localStorage
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem(`quiz_usage_${user?.id}`);
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (data.date === today) {
          setQuizzesUsedToday(data.count);
        } else {
          // Reset if it's a new day
          localStorage.setItem(
            `quiz_usage_${user?.id}`,
            JSON.stringify({ date: today, count: 0 })
          );
          setQuizzesUsedToday(0);
        }
      } catch (error) {
        console.error("Error parsing quiz usage data", error);
        setQuizzesUsedToday(0);
      }
    } else {
      // Initialize if no data exists
      localStorage.setItem(
        `quiz_usage_${user?.id}`,
        JSON.stringify({ date: today, count: 0 })
      );
      setQuizzesUsedToday(0);
    }
  }, [user?.id, isSignedIn]);

  const incrementUsage = () => {
    if (!isSignedIn || !user?.id) return;

    const newCount = quizzesUsedToday + 1;
    const today = new Date().toISOString().split('T')[0];
    
    localStorage.setItem(
      `quiz_usage_${user.id}`,
      JSON.stringify({ date: today, count: newCount })
    );
    
    setQuizzesUsedToday(newCount);
    
    // Notify user when approaching limit
    if (dailyLimit - newCount === 3) {
      toast.warning(`You have only ${dailyLimit - newCount} quizzes remaining today.`);
    } else if (dailyLimit - newCount === 0) {
      toast.error(`You've reached your daily quiz limit. Come back tomorrow or upgrade your plan.`);
    }
  };

  const resetUsage = () => {
    if (!isSignedIn || !user?.id) return;
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(
      `quiz_usage_${user.id}`,
      JSON.stringify({ date: today, count: 0 })
    );
    
    setQuizzesUsedToday(0);
  };

  return {
    quizzesUsedToday,
    quizzesRemaining: Math.max(0, dailyLimit - quizzesUsedToday),
    hasReachedLimit: quizzesUsedToday >= dailyLimit,
    incrementUsage,
    resetUsage
  };
};
