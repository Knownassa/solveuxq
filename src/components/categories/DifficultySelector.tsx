import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizCategory } from '@/utils/quizData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Gauge, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DifficultySelectorProps {
  category: QuizCategory;
  onClose?: () => void;
}

const industries = [
  { value: 'tech', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'any', label: 'Any Industry' }
];

const DifficultySelector = ({ category, onClose }: DifficultySelectorProps) => {
  const [difficulty, setDifficulty] = useState('normal');
  const [industry, setIndustry] = useState('any');
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Use the first quiz ID as a placeholder target for the QuizPage
    // The actual questions will be generated based on difficulty/industry
    const targetQuizId = category.quizzes[0]?.id || 'default-quiz'; 
    
    if (!category.quizzes[0]) {
       console.warn(`Category ${category.id} has no predefined quizzes. Using 'default-quiz' as ID.`);
       // Potentially show a user-facing error or handle differently
    }

    toast({
      title: "Quiz Configuration Saved",
      description: `Preparing ${difficulty} difficulty quiz for ${category.title} (${industry === 'any' ? 'General' : industries.find(i => i.value === industry)?.label}).`,
    });

    // Navigate to the QuizPage with the placeholder quizId and selected parameters
    navigate(`/quiz/${targetQuizId}?difficulty=${difficulty}&industry=${industry}`);

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Select Difficulty Level</h3>
        <RadioGroup
          defaultValue="normal"
          value={difficulty}
          onValueChange={setDifficulty}
          className="grid grid-cols-3 gap-2"
        >
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center space-x-2 border rounded-md p-3 w-full cursor-pointer hover:border-primary ${difficulty === 'easy' ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setDifficulty('easy')}
            >
              <RadioGroupItem value="easy" id="easy" className="sr-only" />
              <Zap className="h-5 w-5 text-green-500" />
              <Label htmlFor="easy" className="cursor-pointer">Easy</Label>
            </div>
            <span className="text-xs text-muted-foreground mt-1">~5 questions</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center space-x-2 border rounded-md p-3 w-full cursor-pointer hover:border-primary ${difficulty === 'normal' ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setDifficulty('normal')}
            >
              <RadioGroupItem value="normal" id="normal" className="sr-only" />
              <Gauge className="h-5 w-5 text-blue-500" />
              <Label htmlFor="normal" className="cursor-pointer">Normal</Label>
            </div>
            <span className="text-xs text-muted-foreground mt-1">~10 questions</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center space-x-2 border rounded-md p-3 w-full cursor-pointer hover:border-primary ${difficulty === 'hard' ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setDifficulty('hard')}
            >
              <RadioGroupItem value="hard" id="hard" className="sr-only" />
              <BrainCircuit className="h-5 w-5 text-red-500" />
              <Label htmlFor="hard" className="cursor-pointer">Hard</Label>
            </div>
            <span className="text-xs text-muted-foreground mt-1">~15 questions</span>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Industry Focus (Optional)</h3>
        <Select defaultValue="any" value={industry} onValueChange={setIndustry}>
          <SelectTrigger>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industryOption) => (
              <SelectItem key={industryOption.value} value={industryOption.value}>
                {industryOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Questions will be tailored to the selected industry context by solveUXQ AI.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleStartQuiz} className="bg-accent text-accent-foreground hover:bg-accent/90">
          Generate & Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default DifficultySelector;
