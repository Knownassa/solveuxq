
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

// Mock data for the leaderboard
const leaderboardData = [
  { id: 1, name: "Alex Johnson", score: 950, quizzes: 42, badges: 5 },
  { id: 2, name: "Jamie Smith", score: 875, quizzes: 38, badges: 4 },
  { id: 3, name: "Taylor Brown", score: 820, quizzes: 36, badges: 4 },
  { id: 4, name: "Jordan Lee", score: 765, quizzes: 32, badges: 3 },
  { id: 5, name: "Casey Wilson", score: 730, quizzes: 30, badges: 3 },
  { id: 6, name: "Riley Cooper", score: 680, quizzes: 28, badges: 2 },
  { id: 7, name: "Avery Garcia", score: 650, quizzes: 25, badges: 2 },
  { id: 8, name: "Morgan Martinez", score: 610, quizzes: 23, badges: 1 },
  { id: 9, name: "Drew Taylor", score: 580, quizzes: 21, badges: 1 },
  { id: 10, name: "Quinn Davis", score: 550, quizzes: 20, badges: 1 },
];

const LeaderboardPage = () => {
  const { user } = useUser();
  const currentUsername = user?.firstName || "You";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-5xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            See how you stack up against other UX enthusiasts
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border rounded-xl overflow-hidden shadow"
        >
          <div className="bg-muted px-6 py-4">
            <div className="grid grid-cols-12 text-sm font-semibold">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">User</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Quizzes</div>
              <div className="col-span-2 text-center">Badges</div>
            </div>
          </div>
          
          <div className="divide-y">
            {leaderboardData.map((user, index) => (
              <div 
                key={user.id}
                className={`px-6 py-4 transition-colors ${index === 2 ? "bg-yellow-50 dark:bg-yellow-900/10" : ""}`}
              >
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-1 text-center font-semibold">
                    {index === 0 ? (
                      <Trophy className="h-6 w-6 text-yellow-500 inline" />
                    ) : index === 1 ? (
                      <Medal className="h-6 w-6 text-gray-400 inline" />
                    ) : index === 2 ? (
                      <Award className="h-6 w-6 text-amber-700 inline" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="col-span-5 font-medium">
                    {index === 2 ? currentUsername : user.name}
                    {index < 3 && (
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        index === 0 ? "bg-yellow-100 text-yellow-800" : 
                        index === 1 ? "bg-gray-200 text-gray-800" : 
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-center">{user.score}</div>
                  <div className="col-span-2 text-center">{user.quizzes}</div>
                  <div className="col-span-2 text-center">
                    {Array(user.badges).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 inline-block" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
