import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { quizCategories } from '@/utils/quizData';
import QuizCard from '@/components/quiz/QuizCard';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useTheme } from '@/hooks/use-theme';

const CategoryList = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="py-20 px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Quiz Categories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Choose from our specialized quiz categories to enhance your skills in different areas of design and problem-solving.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quizCategories.map((category, index) => (
            <AnimatedCard
              key={category.id}
              index={index}
              className="hover-lift"
            >
              <Link to={`/category/${category.id}`} className="block p-6">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{category.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{category.description}</p>
              </Link>
            </AnimatedCard>
          ))}
        </div>

        {quizCategories.length > 0 && (
          <div className="mt-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            >
              Featured Quizzes
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizCategories
                .flatMap(category => category.quizzes)
                .slice(0, 3)
                .map((quiz, index) => (
                  <QuizCard key={quiz.id} quiz={quiz} index={index} />
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList;
