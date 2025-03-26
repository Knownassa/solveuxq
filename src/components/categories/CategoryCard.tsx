import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizCategory } from '@/utils/quizData';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DifficultySelector from './DifficultySelector';

interface CategoryCardProps {
  category: QuizCategory;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <AnimatedCard 
            className="p-6 h-full flex flex-col cursor-pointer hover-lift" 
            index={index}
            variant="default"
          >
            <div className="flex items-center justify-center mb-4 text-4xl">
              {category.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{category.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{category.description}</p>
            <div className="mt-auto">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {category.quizzes.length} quiz{category.quizzes.length !== 1 ? 'zes' : ''}
              </span>
            </div>
          </AnimatedCard>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span> 
            <span>{category.title}</span>
          </DialogTitle>
          <DialogDescription>
            {category.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <DifficultySelector category={category} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCard;
